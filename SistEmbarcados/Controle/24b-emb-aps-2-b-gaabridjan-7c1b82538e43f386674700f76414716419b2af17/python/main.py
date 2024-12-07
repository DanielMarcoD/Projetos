import serial
from pynput.keyboard import Key, Controller

# Configuração da porta serial
ser = serial.Serial('COM3', 115200)  # Altere 'COM3' para a porta correta no Windows

# Mapeamento dos botões para teclas
button_key_map = {
    2: 'w',  # Botão 1 -> Barra de espaço
    3: 'k',      # Botão 2 -> Tecla 'K'
    4: 'j',      # Botão 3 -> Tecla 'J'
    5: 'l',       # Botão 4 -> Tecla 'L'
    6: 'h'
}

# Estado atual das teclas do joystick
joystick_keys = {'up': False, 'down': False, 'left': False, 'right': False}

# Inicialização do controlador de teclado
keyboard_controller = Controller()

def parse_data(data):                                       
    packet_type = data[0]
    identifier = data[1]
    if packet_type == 0xBB:
        value = data[2]  # Estado do botão é diretamente o terceiro byte
    else:
        value = int.from_bytes(data[2:4], byteorder='big', signed=True)
    return packet_type, identifier, value

def handle_joystick(axis, value):
    threshold = 150
    release_threshold = 70
    global joystick_keys

    # Inicializa as variáveis para evitar erro de referência antes da atribuição
    up = joystick_keys['up']
    down = joystick_keys['down']
    left = joystick_keys['left']
    right = joystick_keys['right']

    # Atualiza o estado dos eixos
    if axis == 0:  # Eixo X
        if value < -threshold:
            left = True
            right = False
        elif value > threshold:
            left = False
            right = True
        else:
            if joystick_keys['left'] and value < -release_threshold:
                left = True
            else:
                left = False
            if joystick_keys['right'] and value > release_threshold:
                right = True
            else:
                right = False
    elif axis == 1:  # Eixo Y
        if value < -threshold:
            up = True
            down = False
        elif value > threshold:
            up = False
            down = True
        else:
            if joystick_keys['up'] and value < -release_threshold:
                up = True
            else:
                up = False
            if joystick_keys['down'] and value > release_threshold:
                down = True
            else:
                down = False

    # Verifica mudanças no estado das teclas
    new_states = {
        'up': up,
        'down': down,
        'left': left,
        'right': right
    }

    for direction in ['up', 'down', 'left', 'right']:
        if joystick_keys[direction] != new_states[direction]:
            key = ''
            if direction == 'up':
                key = 'w'
            elif direction == 'down':
                key = 's'
            elif direction == 'left':
                key = 'a'
            elif direction == 'right':
                key = 'd'

            if new_states[direction]:
                keyboard_controller.press(key)
                print(f"Key '{key}' Pressed")
            else:
                keyboard_controller.release(key)
                print(f"Key '{key}' Released")

    joystick_keys = new_states

def handle_button(button_id, state):
    if button_id in button_key_map:
        key = button_key_map[button_id]
        if state == 1:
            keyboard_controller.press(key)
            print(f"Key '{key}' Pressed")
        else:
            keyboard_controller.release(key)
            print(f"Key '{key}' Released")

try:
    while True:
        sync_byte = ser.read(1)
        if sync_byte == b'\xaa' or sync_byte == b'\xbb':
            data = ser.read(4)
            if len(data) == 4:
                packet_type, identifier, value = parse_data([sync_byte[0]] + list(data))
                if packet_type == 0xAA:
                    handle_joystick(identifier, value)
                elif packet_type == 0xBB:
                    state = value
                    handle_button(identifier, state)
            else:
                print("Error: Incomplete data packet received")
        else:
            print(f"Unexpected sync byte: {sync_byte}")
except KeyboardInterrupt:
    print("Program terminated by user")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    ser.close()
