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

""" 
Rode cada linha em um terminal diferente
    roslaunch my_simulation trevo.launch
    rosrun aps4 pista.py
"""
class Pista(ImageModule):
    def __init__(self):
        super().__init__()
        ImageModule.__init__(self)
        self.rate = rospy.Rate(250) # 250 Hz
        self.data = Odometry()
        # # HSV Filter
        self.color_param = {
             "yellow": {
                 "lower": (18,71,100),
                 "upper": (40,255,255)
             },
             "yellowvirtual":{
                 "lower": (26,62,227),
                 "upper": (40,255,255)
             }
         }
       
        self.twist = Twist()
  
        self.point = Point()

        self.viredireita = 0

        self.visaoesquerda = 0
        
        self.centro_certo = (0,0)
        
        self.centro_virar = (0,0)

        self.kp    = 1000

        # Subscribers
        self.bridge = CvBridge()
        self.odom_sub = rospy.Subscriber("/odom",Odometry,self.odom_callback)
        self.laser_subscriber = rospy.Subscriber('/scan',LaserScan, self.laser_callback)
        self.image_sub = rospy.Subscriber('/camera/image/compressed',CompressedImage,self.image_callback,queue_size=1,buff_size = 2**24)
        
        # Publishers
        self.cmd_vel_pub = rospy.Publisher("cmd_vel", Twist, queue_size=3)
        self.cmd_vel_pub.publish(Twist())
        
        

       
        self.robot_state = "anda"
        self.robot_machine = {
            "procura": self.procura,
            "anda": self.anda,
            "parar": self.parar,
            
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
      
        coordenada1= int(0.55*hsv.shape[0])
        coordenada2 = int(hsv.shape[0])
        coordenada3 = int(0 * hsv.shape[1])
        coordenada4 = int(1*hsv.shape[1])
        if self.visaoesquerda == 0:
            hsv = hsv[coordenada1:coordenada2,coordenada3:coordenada4]    
        else:
            coordenada1= int(0.55*hsv.shape[0])
            coordenada2 = int(hsv.shape[0])
            coordenada3 = int(0.6 * hsv.shape[1])
            coordenada4 = int(1*hsv.shape[1])
            hsv = hsv[coordenada1:coordenada2,coordenada3:coordenada4]   
        c2 = int(hsv.shape[0])
        
        mask = self.color_filter(hsv,lower_hsv,upper_hsv)
        kernel =  cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (1, 1))
        mask = cv2.erode(mask, kernel, iterations=1)
        contornos= self.find_contours(mask)
        meio = int(hsv.shape[1]/2)
        if len(contornos)==0 :
            return -1
        contornos = self.order_contours(contornos)
        distancia_minima = 100000000000000
        centro_proximo = (0,0)
        self.contador = 0
        for cont in contornos:
            self.Area = self.contour_area(cont)
            
            
            if self.Area>2000:
                
                centro = self.contour_center(cont)
            

                dist = np.sqrt((centro[0]-meio)**2 + (centro[1]-c2)**2)
                if dist< distancia_minima:
                    distancia_minima = dist
                    centro_proximo = centro
           
            
            
        mask = self.cross_hair(mask,centro_proximo,(0,255,0),5)
        cv2.imshow("la",mask)
        #cv2.imshow("l",hsv)
        cv2.waitKey(1)
        self.point.z = hsv.shape[1]/2
        if self.contador==1 or self.contador==2:
            return -1 
        return centro_proximo
       
        
    def image_callback(self, msg: CompressedImage) -> None:
        """
        Callback function for the image topic
        """
        try:
            cv_image = self.bridge.compressed_imgmsg_to_cv2(msg, "bgr8")
            
        except CvBridgeError as e:
            print(e)

         
        self.centro_certo = self.color_segmentation(cv_image,self.color_param['yellowvirtual']['lower'],self.color_param['yellowvirtual']['upper'])
        if self.centro_certo!=-1:
            self.point.x = self.centro_certo[0]
        
    def procura(self):
        if self.centro_certo ==-1:
            self.twist.angular.z = 0.09
        else:
            self.twist = Twist()
            self.robot_state = "anda"
            
    def get_error(self):
        self.erro = self.point.z - self.point.x
        self.twist.angular.z = self.erro / self.kp

                    
    
    def anda(self):
        
        
        if self.centro_certo==-1:
            self.twist = Twist()
            self.robot_state="procura"
        else:
            self.get_error()
            self.twist.linear.x = 0.09



    def parar(self):
        self.twist = Twist()            
        
        
        
      
    def control(self):
        '''
        This function is called at least at {self.rate} Hz.
        This function controls the robot.
        '''
        
        print(f'self.robot_state: {self.robot_state}')
        self.robot_machine[self.robot_state]()

        self.cmd_vel_pub.publish(self.twist)
        
        self.rate.sleep()

def main():
    rospy.init_node('Pista')
    control = Pista()
    rospy.sleep(1)

    while not rospy.is_shutdown():
        control.control()

if __name__=="__main__":
    main()    
        






    
                        
        
   