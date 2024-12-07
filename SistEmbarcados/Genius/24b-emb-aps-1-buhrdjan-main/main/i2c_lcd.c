#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include "i2c_lcd.h"
#include <stdarg.h>
#include "pico/stdlib.h"

#define ENABLE 0x04
#define LCD_BACKLIGHT 0x08
#define NO_BACKLIGHT 0x00
#define COMMAND 0
#define CHAR 1
#define REGISTER_SELECT 0x00
#define CLEAR_DISPLAY 0x01
#define RETURN_HOME 0x02
#define ENTRY_MODE_SET 0x04
#define FUNCTION_SET 0x20
#define DISPLAY_CONTROL 0x08
#define DISPLAY_ON 0x04
#define DISPLAY_OFF 0x00
#define CURSOR_ON 0x02
#define CURSOR_OFF 0x00
#define BLINK_ON 0x01
#define BLINK_OFF 0x00
#define MODE_4_BIT 0x00
#define LINE_2 0x08
#define DOTS_5x8 0x00
#define SET_DDRAM_ADDR 0x80
#define SET_CGRAM_ADDR 0x40
#define ENTRY_LEFT 0x02
#define ENTRY_SHIFT_DECREMENT 0x00

static uint8_t lcd_address;
static uint8_t lcd_columns;
static uint8_t lcd_rows;
static uint8_t lcd_backlight;
static uint8_t lcd_display_function;
static uint8_t lcd_display_control;
static uint8_t lcd_display_mode;
static i2c_inst_t *lcd_i2c_instance;

void lcd_i2c_write_byte(uint8_t val) {
    uint8_t data = val | lcd_backlight;
    int result = i2c_write_blocking(lcd_i2c_instance, lcd_address, &data, 1, false);
    if (result < 0) {
        printf("Erro na comunicação I2C: %d\n", result);
    }
}

void lcd_pulse_enable(uint8_t val) {
    const uint16_t DELAY = 1000;  // Aumentei o atraso para 1ms
    sleep_us(DELAY);
    lcd_i2c_write_byte(val | ENABLE);
    sleep_us(DELAY);
    lcd_i2c_write_byte(val & ~ENABLE);
    sleep_us(DELAY);
}

void lcd_send_nibble(uint8_t val) {
    lcd_i2c_write_byte(val);
    lcd_pulse_enable(val);
}

void lcd_send_byte(uint8_t val, uint8_t mode) {
    uint8_t high = val & 0xF0;
    uint8_t low = (val << 4) & 0xF0;
    lcd_send_nibble(high | mode);
    lcd_send_nibble(low | mode);
}

void lcd_send_command(uint8_t val) {
    lcd_send_byte(val, COMMAND);
    sleep_ms(5);
}

void lcd_send_char(uint8_t val) {
    lcd_send_byte(val, CHAR);
    sleep_us(40);
}

void lcd_init(uint8_t address, uint8_t columns, uint8_t rows, i2c_inst_t *i2c_instance, uint SDA, uint SCL) {
    printf("Iniciando lcd_init...\n");

    lcd_address = address;
    lcd_columns = columns;
    lcd_rows = rows;
    lcd_backlight = LCD_BACKLIGHT;  // Ligando o backlight na inicialização
    lcd_i2c_instance = i2c_instance;

    const size_t BAUD_RATE = 100000;  // 100 kHz, velocidade padrão do I2C
    i2c_init(i2c_instance, BAUD_RATE);
    gpio_set_function(SDA, GPIO_FUNC_I2C);
    gpio_set_function(SCL, GPIO_FUNC_I2C);
    gpio_pull_up(SDA);
    gpio_pull_up(SCL);
    printf("Configuração de GPIO e I2C concluída...\n");

    lcd_display_mode = ENTRY_LEFT | ENTRY_SHIFT_DECREMENT;
    lcd_display_function = MODE_4_BIT | LINE_2 | DOTS_5x8;
    lcd_display_control = DISPLAY_ON | CURSOR_OFF | BLINK_OFF;

    printf("Modo de exibição configurado...\n");

    // Sequência de inicialização para LCDs com controladores HD44780 em modo 4 bits
    lcd_send_command(0x03);
    printf("Primeiro comando 0x03 enviado...\n");
    sleep_ms(5);  // Atraso necessário para alguns LCDs
    lcd_send_command(0x03);
    printf("Segundo comando 0x03 enviado...\n");
    sleep_ms(5);
    lcd_send_command(0x03);
    printf("Terceiro comando 0x03 enviado...\n");
    sleep_ms(5);
    lcd_send_command(0x02);  // Configura para modo de 4 bits
    printf("Comando 0x02 enviado...\n");
    sleep_ms(5);

    lcd_send_command(FUNCTION_SET | lcd_display_function);
    sleep_ms(5);
    lcd_send_command(DISPLAY_CONTROL | lcd_display_control);
    sleep_ms(5);
    lcd_clear();
    sleep_ms(5);
    lcd_send_command(ENTRY_MODE_SET | lcd_display_mode);
    sleep_ms(5);
    lcd_home();
    sleep_ms(5);
    printf("lcd_init concluído...\n");
}

void lcd_display_on() {
    lcd_display_control |= DISPLAY_ON;
    lcd_send_command(DISPLAY_CONTROL | lcd_display_control);
}

void lcd_display_off() {
    lcd_display_control &= ~DISPLAY_ON;
    lcd_send_command(DISPLAY_CONTROL | lcd_display_control);
}

void lcd_backlight_on() {
    lcd_backlight = LCD_BACKLIGHT;
    lcd_i2c_write_byte(lcd_backlight);
}

void lcd_backlight_off() {
    lcd_backlight = NO_BACKLIGHT;
    lcd_i2c_write_byte(lcd_backlight);
}

void lcd_set_backlight(int light_on) {
    if (light_on) {
        lcd_backlight_on();
    } else {
        lcd_backlight_off();
    }
}

void lcd_cursor_on() {
    lcd_display_control |= CURSOR_ON;
    lcd_send_command(DISPLAY_CONTROL | lcd_display_control);
}

void lcd_cursor_off() {
    lcd_display_control &= ~CURSOR_ON;
    lcd_send_command(DISPLAY_CONTROL | lcd_display_control);
}

void lcd_cursor_blink_on() {
    lcd_display_control |= BLINK_ON;
    lcd_send_command(DISPLAY_CONTROL | lcd_display_control);
}

void lcd_cursor_blink_off() {
    lcd_display_control &= ~BLINK_ON;
    lcd_send_command(DISPLAY_CONTROL | lcd_display_control);
}

void lcd_set_text_left_to_right() {
    lcd_display_mode |= ENTRY_LEFT;
    lcd_send_command(ENTRY_MODE_SET | lcd_display_mode);
}

void lcd_set_text_right_to_left() {
    lcd_display_mode &= ~ENTRY_LEFT;
    lcd_send_command(ENTRY_MODE_SET | lcd_display_mode);
}

void lcd_clear() {
    lcd_send_command(CLEAR_DISPLAY);
}

void lcd_home() {
    lcd_send_command(RETURN_HOME);
}

void lcd_set_cursor(uint8_t row, uint8_t column) {
    static const uint8_t ROW_OFFSETS[] = {0x00, 0x40, 0x00, 0x40};
    row = row >= lcd_rows ? lcd_rows - 1 : row;
    column = column >= lcd_columns ? lcd_columns - 1 : column;
    lcd_send_command(SET_DDRAM_ADDR | (ROW_OFFSETS[row] + column));
}

void lcd_print_char(uint8_t character) {
    lcd_send_char(character);
}

void lcd_print_string(const char *str) {
    while (*str) {
        lcd_print_char(*str++);
    }
}

void lcd_create_custom_char(uint8_t location, uint8_t char_map[]) {
    location &= 0x7;  // Limita a localização para 8 posições
    lcd_send_command(SET_CGRAM_ADDR | (location << 3));
    for (int i = 0; i < 8; i++) {
        lcd_send_char(char_map[i]);
    }
}

void lcd_puts(const char *string) {
    while (*string) {
        lcd_print_char(*string++);
    }
}

void lcd_printf(const char *format, ...) {
    char buffer[32];  // Buffer para armazenar a string formatada
    va_list args;
    va_start(args, format);
    vsnprintf(buffer, sizeof(buffer), format, args);
    va_end(args);

    lcd_puts(buffer);
}
