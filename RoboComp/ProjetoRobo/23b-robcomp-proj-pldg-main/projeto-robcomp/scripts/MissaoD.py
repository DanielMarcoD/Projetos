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

class MissaoD(ImageModule,Aruco3d):
    def __init__(self,args):
        #super().__init__()
        Aruco3d.__init__(self)
        ImageModule.__init__(self)
        self.rate = rospy.Rate(250) # 250 Hz
        self.data = Odometry()
        self.twist = Twist()


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
                 "lower": (31,0,0),
                 "upper": (108,255,255)
             },
             "vermelho":{
                 "lower": (0,170,45),
                 "upper": (15,255,255)
             }

         }
        self.point = Point()

        self.entrouu = 1
        self.entrou2 = 1
        self.entrou4 = 1
        self.entrou5 =1
        
        self.id = 0
        self.posicao_inicial_x = self.data.pose.pose.position.x
        self.posicao_inicial_y = self.data.pose.pose.position.y

        self.kp = 1000

    # Subscribers
        self.bridge = CvBridge()
        self.odom_sub = rospy.Subscriber("/odom",Odometry,self.odom_callback)
        self.laser_subscriber = rospy.Subscriber('/scan',LaserScan, self.laser_callback)
        self.image_sub = rospy.Subscriber('/camera/image/compressed',CompressedImage,self.image_callback,queue_size=1,buff_size = 2**24)
        
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
            "viraramarelo": self.viraramarelo
            
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
        self.tras =  self.laser_msg[173:183]

    def color_segmentation(self, hsv: np.ndarray, lower_hsv: np.ndarray, upper_hsv: np.ndarray,) -> Point:
        """ 
        Use HSV color space to segment the image and find the center of the object.

        Args:
            bgr (np.ndarray): image in BGR format
        
        Returns:
            Point: x, y and area of the object
        """
        
        hsv = cv2.cvtColor(hsv, cv2.COLOR_BGR2HSV)
        mask = self.color_filter(hsv,lower_hsv,upper_hsv)
        contornos = self.find_contours(mask)
        if len(contornos)==0:
            return -1
        contornos = self.order_contours(contornos)
        maior_contorno = contornos[0]
        centro = self.contour_center(maior_contorno)
        self.point.z = hsv.shape[1]/2
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
        oi,self.results = self.detectaAruco(cv_image)
        if self.results==[] and self.id1==1:
            self.id=2
        else:
            if self.results!=[]:
                self.id = self.results[0]['id'][0]
                self.centro_aruco = self.results[0]['distancia']
        
        

      
        print(self.args.cor)

        if self.args.cor == "azul":
            self.centro_a_ser_guiado = self.color_segmentation(cv_image,self.color_param["azul"]["lower"],self.color_param['azul']['upper'])
        elif self.args.cor == "verde":
            self.centro_a_ser_guiado = self.color_segmentation(cv_image,self.color_param["verde"]["lower"],self.color_param['verde']['upper'])
        elif self.args.cor == "vermelho":
            self.centro_a_ser_guiado = self.color_segmentation(cv_image,self.color_param["vermelho"]["lower"],self.color_param['vermelho']['upper'])
        if self.centro_a_ser_guiado!=-1:
            self.point.x = self.centro_a_ser_guiado[0]
       
        
    def get_error(self):
        self.erro = self.point.z - self.point.x
        self.twist.angular.z = self.erro / self.kp  

    def procura(self):
        while True:
            if self.id==250 and self.id2==0:
                self.id2=1
            if self.id2==1 and self.id==150:
                # self.posicao_curva_x = self.x
                # self.posicao_curva_y = self.y
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
        self.get_error()
        print(np.min(self.frente))
        if np.min(self.frente)>0.26:
            self.twist.linear.x = 0.1
        else:
            self.claw_control("up")
            rospy.sleep(1)
            self.twist.linear.x = 0
            self.twist.angular.z = 0
            self.claw_control("down")
            rospy.sleep(1)
            self.robot_state = "voltar" 
               

       
    def parar(self):
        self.twist = Twist()
        
        
    def virar(self):
        # self.twist.angular.z = -0.5
        
        print(self.entrouu)
        if self.entrouu == 1:
            
            self.target_time = rospy.Time.now().to_sec() + 6.5
            self.twist.linear.x = 0.09
            self.entrouu = 0
            print("dando uma andada")
            

        
        
        if rospy.Time.now().to_sec()>=self.target_time:
            
            self.twist.linear.x = 0
                
        
            #self.posicao_virar_x = self.x
            #self.posicao_virar_y = self.y
            print(self.entrou2)
            if self.entrou2 ==1:
                print("couto")
                self.target_time2 = rospy.Time.now().to_sec() + 3.5
                self.entrou2=0
                self.twist.angular.z = -0.5
            

            if rospy.Time.now().to_sec()>=self.target_time2:
                self.twist.angular.z = 0
                self.robot_state = "atacar"
            


    def voltar(self):
        if self.entrou4==1:
            self.twist.angular.z=0.5
            self.target_time4 = rospy.Time.now().to_sec() + 6.5
            self.entrou4 = 0
        if rospy.Time.now().to_sec()>= self.target_time4:
            self.twist.angular.z =0
            if self.entrou5==1:
                self.entrou5 =0
                self.target_time5 = rospy.Time.now().to_sec() + 3.0
                self.twist.linear.x = 0.5
            if rospy.Time.now().to_sec()>= self.target_time5:
                self.twist.linear.x =0
                self.robot_state= "viraramarelo"    


        
       
        
                
                
    def viraramarelo(self):
        if self.entrou3==1:
            print("entrou no ultimo")
            self.twist.angular.z =0.5
            self.target_time3=rospy.Time.now().to_sec() + 3.2
            self.entrou3 =0
        if rospy.Time.now().to_sec()>=self.target_time3:
            self.pista.robot_state="anda"        
            while True:
                
                self.pista.control()
                 

           
    def claw_control(self, command: str):

        if command == 'open':
            self.garra.publish(-1.0)
        elif command == 'close':
            self.garra.publish(0.0)
        elif command == 'up':
            self.ombro.publish(1.5)
        elif command == 'mid':
            self.ombro.publish(0.0)
        elif command == 'down':
            self.ombro.publish(-1.0)        

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
    rospy.init_node('MissaoD')
    control = MissaoD(args)
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
        
        

    

