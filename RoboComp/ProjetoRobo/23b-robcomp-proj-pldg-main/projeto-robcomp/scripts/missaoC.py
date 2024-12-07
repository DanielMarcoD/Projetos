#! /usr/bin/env python3
# -*- coding:utf-8 -*-

import rospy

import numpy as np
import cv2
from geometry_msgs.msg import Twist, Vector3
from geometry_msgs.msg import Twist, PointStamped
from sensor_msgs.msg import LaserScan
from sensor_msgs.msg import CompressedImage
from cv_bridge import CvBridge,CvBridgeError
import numpy as np
from geometry_msgs.msg import Point
import random
from nav_msgs.msg import Odometry
from tf.transformations import euler_from_quaternion
from module import ImageModule
from goto import GoTo
from module_aruco import Aruco3d
from module_net import MobileNetDetector
from pista import Pista
from std_msgs.msg import Float64


class missaoC(ImageModule,Aruco3d,MobileNetDetector):
    def __init__(self,args):
        #super().__init__()
        Aruco3d.__init__(self)
        ImageModule.__init__(self)
        MobileNetDetector.__init__(self)
        self.rate = rospy.Rate(250) # 250 Hz
        self.data = Odometry()
        self.twist = Twist()

        self.Aruco = Aruco3d()
        self.Mobilenet = MobileNetDetector()


        self.achoucat = 2

        self.id1 = 0
        self.id2= 0

        self.entrou3=1
         
       

        
        self.args = args

        self.pista = Pista()

        self.color_param = {
             "azul": {
                 "lower": (105,50,40),
                 "upper": (130,255,255)
             },
             "verde":{
                 "lower": (14,63,17),
                 "upper": (100,255,147)
             },
             "vermelho":{
                 "lower": (0,170,45),
                 "upper": (15,255,255)
             },
             "CaixaAzul":{
                 "lower": (100,50,14),
                 "upper":(150,255,255)
                 
             },
             "verdevirtual":{
                 "lower":(35,109,157),
                 "upper":(68,255,255)
                 
             },
             "CaixaAzulVirtual":{
                 "lower":(120,59,58),
                 "upper":(137,255,255)
             }

         }
        self.point = Point()

        self.abrir = 0

        self.entrouparavirar = 0

        self.time13 = 0

        self.fechou = 0

        self.ateacaixa = 0

        self.girarparadeixar = 0

        self.entrouu = 1
        self.entrou2 = 1
        self.entrou4 = 1
        self.entrou5 =1

        self.chegaCaixa = 0

        self.target_timevirar = 0

        self.entroucat = True

        self.levantou = 0
        self.andaateomeio= 0 

        self.sobe =0
        self.caixaazul = 0

        self.iniciou = 0

        self.virardireitafinal = 0
        
        self.id = 0
       
        self.posicao_inicial_x = self.data.pose.pose.position.x
        self.posicao_inicial_y = self.data.pose.pose.position.y

        self.distancia_robo_centro = 10000000000

        self.kp = 1000

        self.centro_caixa = 0

    # Subscribers
        self.bridge = CvBridge()
        self.odom_sub = rospy.Subscriber("/odom",Odometry,self.odom_callback)
        self.laser_subscriber = rospy.Subscriber('/scan',LaserScan, self.laser_callback)
        self.image_sub = rospy.Subscriber('/camera/image/compressed',CompressedImage,self.image_callback,queue_size=1,buff_size = 2**24)
        self.image_aruco_sub = rospy.Subscriber('/camera/image/compressed',CompressedImage,self.image_callback_aruco,queue_size=1,buff_size = 2**24)
        self.image_mobilenet_sub = rospy.Subscriber('/camera/image/compressed',CompressedImage,self.image_callback_mobilenet,queue_size=1,buff_size = 2**24)

        
        # Publishers
        self.cmd_vel_pub = rospy.Publisher("cmd_vel", Twist, queue_size=3)
        self.cmd_vel_pub.publish(Twist())
        self.ombro = rospy.Publisher("/joint1_position_controller/command", Float64, queue_size=1)
        self.garra = rospy.Publisher("/joint2_position_controller/command", Float64, queue_size=1)

      


        self.robot_state = "procura"
        self.robot_machine = {
            "procura": self.procura,
            "virar": self.virar,
            "atacar": self.atacar,
            "voltar": self.voltar,
            "parar": self.parar,
            "cat": self.cat,
            "deixarobo": self.deixarobo,
            "voltaprapista": self.voltaprapista,
            "viredireita": self.viredireita  
            
        }
    def odom_callback(self, data: Odometry):
        self.odom = data
        self.x = data.pose.pose.position.x
        self.y = data.pose.pose.position.y
        self.z = data.pose.pose.position.z
        
        orientation_list = [data.pose.pose.orientation.x,
                            data.pose.pose.orientation.y,
                            data.pose.pose.orientation.z,
                            data.pose.pose.orientation.w]

        self.roll, self.pitch, self.yaw = euler_from_quaternion(orientation_list)
    
    def laser_callback(self, msg: LaserScan) -> None:
        self.laser_msg = np.array(msg.ranges).round(decimals=2) # Converte para np.array e arredonda para 2 casas decimais
        self.laser_msg[self.laser_msg == 0] = np.inf
        self.laser_msg = list(self.laser_msg)

        self.frente = self.laser_msg[-5:] + self.laser_msg[:5]
        self.frente3 = self.laser_msg[5:10]
        self.frente2 = self.laser_msg[-10:-5] 
        self.tras =  self.laser_msg[173:183]
        self.esquerda = self.laser_msg[265:275]
        print(np.min(self.frente3))

    def color_segmentation(self, hsv: np.ndarray, lower_hsv: np.ndarray, upper_hsv: np.ndarray,id,) -> Point:
        """ 
        Use HSV color space to segment the image and find the center of the object.

        Args:
            bgr (np.ndarray): image in BGR format
        
        Returns:
            Point: x, y and area of the object
        """
        lista_contornos = []
        hsv = cv2.cvtColor(hsv, cv2.COLOR_BGR2HSV)
        mask = self.color_filter(hsv,lower_hsv,upper_hsv)
        contornos = self.find_contours(mask)
        
        if len(contornos)==0:
            return -1
        contornos = self.order_contours(contornos)
        for i in range (len(contornos)):
            if len(contornos[i])>0 and i<=1:
                
                if self.contour_area(contornos[i])>1000:
                    lista_contornos.append(contornos[i])
        if len(lista_contornos)==0:
                
                return -1            

       
        maior_contorno = lista_contornos[0]
        centro = self.contour_center(maior_contorno)
        mask = self.cross_hair(mask,centro,(0,255,0),5)
        self.point.z = hsv.shape[1]/2

        if self.caixaazul==0:
            if len(lista_contornos)>1:
                Segundomaior_contorno = contornos[1]
                Segundocentro = self.contour_center(Segundomaior_contorno)
                mask = self.cross_hair(mask,Segundocentro,(0,255,0),5)
            cv2.imshow("ollla",mask)
            cv2.waitKey(1)

            if len(lista_contornos)>1:
                
                for resultados in self.resultsAruco:
                    if resultados["id"][0]==id:
                        
                        D1 = np.sqrt((centro[0] - resultados["centro"][0])**2 + (centro[1] - resultados["centro"][1])**2)
                        D2 = np.sqrt((Segundocentro[0] - resultados["centro"][0])**2 + (Segundocentro[1] - resultados["centro"][1])**2)
                        
                        if D1<D2:
                            return centro
                        else:
                            return Segundocentro
            else:
              
                return centro            
           

           
           
        elif self.caixaazul==1:
            cv2.imshow("ollla",mask)
            cv2.waitKey(1)
            self.distancia_robo_centro = np.sqrt((centro[0] -self.point.z) + (centro[1] - hsv.shape[0])**2)
            
            return centro
        
        
            
       
       
        
    def image_callback(self, msg: CompressedImage) -> None:
        """
        Callback function for the image topic
        """
        try:
            cv_image = self.bridge.compressed_imgmsg_to_cv2(msg, "bgr8")
            
        except CvBridgeError as e:
            print(e)

        _,self.resultsAruco = self.detectaAruco(cv_image)    
        if self.resultsAruco==[] and self.id1==1:
            self.id=2
        else:
            if self.resultsAruco!=[]:
                self.id = self.resultsAruco[0]['id'][0]
                self.centro_aruco = self.resultsAruco[0]['distancia']


        imgcat,self.resultsMob = self.detect(cv_image)

       

        if self.args.cor == "azul" and self.caixaazul==0:
            self.centro_a_ser_guiado = self.color_segmentation(cv_image,self.color_param["azul"]["lower"],self.color_param['azul']['upper'], self.args.id)
        elif self.args.cor == "verde" and self.caixaazul==0:
            self.centro_a_ser_guiado = self.color_segmentation(cv_image,self.color_param["verde"]["lower"],self.color_param['verde']['upper'], self.args.id)
        elif self.args.cor == "vermelho" and self.caixaazul==0:
            self.centro_a_ser_guiado = self.color_segmentation(cv_image,self.color_param["vermelho"]["lower"],self.color_param['vermelho']['upper'], self.args.id)
        if self.centro_a_ser_guiado!=-1 and self.caixaazul==0:
            self.point.x = self.centro_a_ser_guiado[0] -35
        if self.achoucat ==0:
            self.caixaazul = 1
            self.centro_caixa = self.color_segmentation(cv_image,self.color_param["CaixaAzul"]["lower"],self.color_param['CaixaAzul']['upper'], self.args.id)
            self.centro_a_ser_guiado = 0
            if self.centro_caixa!=-1:
                self.point.x = self.centro_caixa[0]
    def image_callback_aruco(self, msg: CompressedImage) -> None:
        """
		Callback function for the image topic
		"""
        try:

            cv_image = self.bridge.compressed_imgmsg_to_cv2(msg, "bgr8")
        except CvBridgeError as e:
            print(e)
		
        self.gr, self.results = self.Aruco.detectaAruco(cv_image.copy()) # Processamento da imagem



    def image_callback_mobilenet(self, msg: CompressedImage) -> None:
        """
		Callback function for the image topic
		"""
        try:
            cv_image = self.bridge.compressed_imgmsg_to_cv2(msg, "bgr8")
        except CvBridgeError as e:
            print(e)
		
        self.Mobilenet.detect(cv_image)            
                
            
    
            
            

       
        
    def get_error(self):
        self.erro = self.point.z - self.point.x
        self.twist.angular.z = self.erro / self.kp  

    def procura(self):
        if self.iniciou==0:
            self.iniciou = 1
            self.claw_control("down")
            rospy.sleep(2.0)
            self.claw_control("down")
            rospy.sleep(2.0)
            self.claw_control("close")
            rospy.sleep(0.5)
            self.claw_control("close")
            rospy.sleep(0.5)
        while True:
            if self.id==250 and self.id2==0:
                self.id2=1
            if self.id2==1 and self.id==150:
                self.posicao_curva_x = self.x
                self.posicao_curva_y = self.y
                self.id2=2    
            if self.id==150:
                self.id1=1
            if self.id==2:
                break    
            self.pista.control()
        self.pista.robot_state = "para"
        self.twist = Twist()
        self.robot_state = "virar"


    def atacar(self):
        if self.abrir==0:
            self.abrir=1
            self.claw_control("open")
            rospy.sleep(0.5)
       

        self.get_error()
        print(np.min(self.frente))
        if np.min(self.frente)>0.2:
            self.twist.linear.x = 0.02
        else:
            self.twist.linear.x = 0
            self.twist.angular.z = 0
            self.claw_control("up")
            rospy.sleep(0.5)
            self.robot_state = "voltar" 
               

       
    def parar(self):
        self.twist = Twist()
        
        
    def virar(self):
        # self.twist.angular.z = -0.5
        
        
        if self.entrouu == 1:
            
            self.target_time = rospy.Time.now().to_sec() + 5.8
            self.twist.linear.x = 0.09
            self.entrouu = 0
           
            

        
        
        if rospy.Time.now().to_sec()>=self.target_time:
            
            self.twist.linear.x = 0
                
        
            # self.posicao_virar_x = self.x
            # self.posicao_virar_y = self.y
            
            if self.entrou2 ==1:
                
                self.target_time2 = rospy.Time.now().to_sec() + 3.0
                self.entrou2=0
                self.twist.angular.z = -0.5
            

            if rospy.Time.now().to_sec()>=self.target_time2:
                self.twist.angular.z = 0
                self.robot_state = "atacar"
            


    def voltar(self):
        if self.fechou==0:
            self.fechou=1
            self.claw_control("close")
            rospy.sleep(1.0)
            self.claw_control("close")
            rospy.sleep(1.0)
            self.claw_control("uptot")
            rospy.sleep(0.5)
            self.claw_control("uptot")
            rospy.sleep(0.5)
            
        



        if self.entrou4==1:
            self.twist.angular.z=0.5
            self.target_time4 = rospy.Time.now().to_sec() + 6.3
            self.entrou4 = 0
        if rospy.Time.now().to_sec()>= self.target_time4:
            self.twist.angular.z =0
            if self.entrou5!=0:
                self.achoucat=0 
                while True:
                    if self.andaateomeio == 0:
                         self.andaateomeio=1
                         self.target_time10= rospy.Time.now().to_sec() + 9
                    if rospy.Time.now().to_sec()>= self.target_time10:
                        break    


                    self.achoucat=0 
                    self.pista.robot_state = "anda"
                    self.pista.control()

                   
            
            self.pista.robot_state = "para"   
            self.entrou5 =0
            self.twist.linear.x = 0
            self.robot_state = "cat"

            
    def cat(self):
        self.achoucat = 0
        self.twist.linear.x = 0.09
        self.get_error()
    

        if self.chegaCaixa == 0:
            self.target_time11 = rospy.Time.now().to_sec() + 10
            self.chegaCaixa = 1


        if rospy.Time.now().to_sec()>=self.target_time11:
           
            self.twist.linear.x = 0
            self.twist.angular.z = 0
            self.robot_state = "deixarobo"


        

        

        # if self.ateacaixa==0:
        #     self.ateacaixa = 1
        #     self.target_time6 = rospy.Time.now().to_sec() + 9

        # if  rospy.Time.now().to_sec()>= self.target_time6:
        #     self.twist.linear.x =0
        #     self.twist.angular.z = 0
        #     self.robot_state = "deixarobo"


        
    def deixarobo(self):
        self.claw_control("mid")
        rospy.sleep(2.0)
        self.claw_control("mid")
        rospy.sleep(2.0)
        self.claw_control("open")
        rospy.sleep(2.0)
        self.claw_control("open")
        rospy.sleep(2.0)
        self.robot_state = "voltaprapista"
        

    def voltaprapista(self):
        if self.entroucat:
            self.target_timecat = rospy.Time.now().to_sec() + 2.5
            self.entroucat=False
            self.twist.linear.x = -0.2
        if rospy.Time.now().to_sec()>=self.target_timecat:
            self.claw_control("down")
            rospy.sleep(1)
            self.pista.robot_state = "anda"
            while True:
                self.pista.control()
                if self.entrouparavirar==0:
                    self.entrouparavirar = 1
                    self.target_timevirar = rospy.Time.now().to_sec() + 50
                if rospy.Time.now().to_sec()>= self.target_timevirar:
                    break
            self.pista.robot_state = "para"
            self.twist.linear.x = 0
            self.twist.angular.z = 0    
            self.robot_state = "viredireita"
    def viredireita(self):
        if self.time13 == 0:
             
            self.target_time15 = rospy.Time.now().to_sec() + 3.0
            self.twist.angular.z = -0.5
            self.time13 = 1
        if rospy.Time.now().to_sec()>= self.target_time15:
            self.pista.robot_state = "anda"

            while True:
                self.pista.control()
                if self.pista.robot_state == "procura":
                    break
            self.pista.robot_state = "para"
            self.robot_state = "parar"    
        
    def claw_control(self, command: str):

        if command == 'open':
            self.garra.publish(-1.5)
        elif command == 'close':
            self.garra.publish(0.0)
        elif command == 'up':
            self.ombro.publish(0.18)
        elif command == 'mid':
            self.ombro.publish(0.0)
        elif command == 'down':
            self.ombro.publish(-1.5)
        elif command == 'uptot':
            self.ombro.publish(1.5)
        elif command== "uprobovirtual":
            self.ombro.publish(0.40)


    def control(self):
        '''
        This function is called at least at {self.rate} Hz.
        This function controls the robot.
        '''
        
        print(f'self.robot_state: {self.robot_state}')
        self.robot_machine[self.robot_state]()

        self.cmd_vel_pub.publish(self.twist)
        
        self.rate.sleep()

def main(args):
    rospy.init_node('missaoC')
    control = missaoC(args)
    rospy.sleep(1)


    while not rospy.is_shutdown():
        control.control()

if __name__=="__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--cor', type=str, default='verde', help='cor do creeper desejado')
    parser.add_argument('--id', type=int, default=10, help='id do creeper desejado')
    parser.add_argument('--drop', type=str, default='bicicleta', help='drop area desejada')
    args = parser.parse_args()
    main(args)    
        
        

    

