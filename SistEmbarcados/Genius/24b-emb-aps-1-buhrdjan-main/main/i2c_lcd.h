#ifndef LCD_I2C_H
#define LCD_I2C_H

#include <stdint.h>
#include "hardware/i2c.h"

// Definições para o LCD
#define CLEAR_DISPLAY 0x01
#define RETURN_HOME 0x02
#define ENTRY_MODE_SET 0x04
#define DISPLAY_CONTROL 0x08
#define CURSOR_SHIFT 0x10
#define FUNCTION_SET 0x20
#define SET_CGRAM_ADDR 0x40
#define SET_DDRAM_ADDR 0x80

// Flags para o modo de entrada do display
#define ENTRY_RIGHT 0x00
#define ENTRY_LEFT 0x02
#define ENTRY_SHIFT_INCREMENT 0x01
#define ENTRY_SHIFT_DECREMENT 0x00

// Flags para o controle do display on/off
#define DISPLAY_ON 0x04
#define DISPLAY_OFF 0x00
#define CURSOR_ON 0x02
#define CURSOR_OFF 0x00
#define BLINK_ON 0x01
#define BLINK_OFF 0x00

// Flags para movimentação do cursor ou display
#define DISPLAY_MOVE 0x08
#define CURSOR_MOVE 0x00
#define MOVE_RIGHT 0x04
#define MOVE_LEFT 0x00

// Flags para configuração de função
#define MODE_8_BIT 0x10
#define MODE_4_BIT 0x00
#define LINE_2 0x08
#define LINE_1 0x00
#define DOTS_5x10 0x04
#define DOTS_5x8 0x00

// Flags para controle do backlight
#define BACKLIGHT 0x08
#define NO_BACKLIGHT 0x00

// Flags especiais
#define ENABLE 0x04
#define READ_WRITE 0x02
#define REGISTER_SELECT 0x01
#define COMMAND 0x00
#define CHAR 0x01

// Tamanho do símbolo customizado
#define CUSTOM_SYMBOL_SIZE 8

// Funções para manipular o LCD
void lcd_i2c_write_byte(uint8_t val);
void lcd_pulse_enable(uint8_t val);
void lcd_send_nibble(uint8_t val);
void lcd_send_byte(uint8_t val, uint8_t mode);
void lcd_send_command(uint8_t val);
void lcd_send_char(uint8_t val);
void lcd_init(uint8_t address, uint8_t columns, uint8_t rows, i2c_inst_t *i2c_instance, uint SDA, uint SCL);
void lcd_display_on();
void lcd_display_off();
void lcd_backlight_on();
void lcd_backlight_off();
void lcd_set_backlight(int light_on);
void lcd_cursor_on();
void lcd_cursor_off();
void lcd_cursor_blink_on();
void lcd_cursor_blink_off();
void lcd_set_text_left_to_right();
void lcd_set_text_right_to_left();
void lcd_clear();
void lcd_home();
void lcd_set_cursor(uint8_t row, uint8_t column);
void lcd_print_char(uint8_t character);
void lcd_print_string(const char *str);
void lcd_create_custom_char(uint8_t location, uint8_t char_map[]);
void lcd_printf(const char *format, ...);
void lcd_puts(const char *string);

#endif // LCD_I2C_H
