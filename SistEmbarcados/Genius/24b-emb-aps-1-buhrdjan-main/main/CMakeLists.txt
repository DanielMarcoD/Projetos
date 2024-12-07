# Define o executável principal
add_executable(main main.c)

# Inclui as bibliotecas e dependências necessárias
target_link_libraries(main
    pico_stdlib          # Biblioteca padrão do Pico
    hardware_i2c         # Biblioteca para comunicação I2C
    hardware_gpio        # Biblioteca para manipulação de GPIO
    hardware_flash       # Biblioteca para acesso à memória flash
)

# Adiciona o arquivo i2c_lcd.c como fonte
target_sources(main PRIVATE i2c_lcd.c)

# Gera arquivos adicionais como map/bin/hex/uf2, etc.
pico_add_extra_outputs(main)
