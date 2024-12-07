#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "hardware/structs/systick.h"
#include <stdlib.h>
#include <string.h>
#include "hardware/i2c.h"
#include <stdarg.h>
#include "hardware/flash.h"
#include "hardware/sync.h"
#include "i2c_lcd.h"

#define I2C_PORT i2c0
#define SDA_PIN 4
#define SCL_PIN 5
#define LCD_COLUMNS 16
#define LCD_ROWS 2

#define FLASH_TARGET_OFFSET (256 * 1024)  // Endereço na flash para armazenar os dados
#define SCORE_ADDRESS (XIP_BASE + FLASH_TARGET_OFFSET)

#define NOTE_B0  31
#define NOTE_C1  33
#define NOTE_CS1 35
#define NOTE_D1  37
#define NOTE_DS1 39
#define NOTE_E1  41
#define NOTE_F1  44
#define NOTE_FS1 46
#define NOTE_G1  49
#define NOTE_GS1 52
#define NOTE_A1  55
#define NOTE_AS1 58
#define NOTE_B1  62
#define NOTE_C2  65
#define NOTE_CS2 69
#define NOTE_D2  73
#define NOTE_DS2 78
#define NOTE_E2  82
#define NOTE_F2  87
#define NOTE_FS2 93
#define NOTE_G2  98
#define NOTE_GS2 104
#define NOTE_A2  110
#define NOTE_AS2 117
#define NOTE_B2  123
#define NOTE_C3  131
#define NOTE_CS3 139
#define NOTE_D3  147
#define NOTE_DS3 156
#define NOTE_E3  165
#define NOTE_F3  175
#define NOTE_FS3 185
#define NOTE_G3  196
#define NOTE_GS3 208
#define NOTE_A3  220
#define NOTE_AS3 233
#define NOTE_B3  247
#define NOTE_C4  262
#define NOTE_CS4 277
#define NOTE_D4  294
#define NOTE_DS4 311
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_FS4 370
#define NOTE_G4  392
#define NOTE_GS4 415
#define NOTE_A4  440
#define NOTE_AS4 466
#define NOTE_B4  494
#define NOTE_C5  523
#define NOTE_CS5 554
#define NOTE_D5  587
#define NOTE_DS5 622
#define NOTE_E5  659
#define NOTE_F5  698
#define NOTE_FS5 740
#define NOTE_G5  784
#define NOTE_GS5 831
#define NOTE_A5  880
#define NOTE_AS5 932
#define NOTE_B5  988
#define NOTE_C6  1047
#define NOTE_CS6 1109
#define NOTE_D6  1175
#define NOTE_DS6 1245
#define NOTE_E6  1319
#define NOTE_F6  1397
#define NOTE_FS6 1480
#define NOTE_G6  1568
#define NOTE_GS6 1661
#define NOTE_A6  1760
#define NOTE_AS6 1865
#define NOTE_B6  1976
#define NOTE_C7  2093
#define NOTE_CS7 2217
#define NOTE_D7  2349
#define NOTE_DS7 2489
#define NOTE_E7  2637
#define NOTE_F7  2794
#define NOTE_FS7 2960
#define NOTE_G7  3136
#define NOTE_GS7 3322
#define NOTE_A7  3520
#define NOTE_AS7 3729
#define NOTE_B7  3951
#define NOTE_C8  4186
#define NOTE_CS8 4435
#define NOTE_D8  4699
#define NOTE_DS8 4978
#define LOW_ERROR_NOTE 100

// Pin definitions
const int BTN_PIN_VERMELHO = 6;
const int BTN_PIN_AZUL = 7;
const int BTN_PIN_VERDE = 9;
const int BTN_PIN_AMARELO = 8;
const int BTN_START = 16;

const int LED_PIN_VERMELHO = 2;
const int LED_PIN_AZUL = 19;
const int LED_PIN_VERDE = 18;
const int LED_PIN_AMARELO = 3;

const int BUZZER_PIN = 28;

// Volatile flags for button interrupts
volatile int btn_flag_vermelho = -1;
volatile int btn_flag_azul = -1;
volatile int btn_flag_verde = -1;
volatile int btn_flag_amarelo = -1;
volatile int btn_flag_start = -1;

// Função para salvar o score na flash
void save_score(int score) {
    uint32_t ints = save_and_disable_interrupts(); // Desabilita interrupções para evitar conflitos
    flash_range_erase(FLASH_TARGET_OFFSET, FLASH_SECTOR_SIZE);
    flash_range_program(FLASH_TARGET_OFFSET, (uint8_t*)&score, sizeof(score));
    restore_interrupts(ints);
}

// Função para ler o score da flash
int read_score() {
    const int *flash_score = (const int *) SCORE_ADDRESS;
    // Se o valor na memória flash não for plausível, retorna 0
    if (*flash_score < 0 || *flash_score > 10000) {
        return 0;
    }
    return *flash_score;
}

// Interrupt handler for button press
void btn_callback(uint gpio, uint32_t events) {
    if (events == GPIO_IRQ_EDGE_FALL) {
        if (gpio == BTN_PIN_VERMELHO) {
            btn_flag_vermelho = 0;
        } else if (gpio == BTN_PIN_VERDE) {
            btn_flag_verde = 0;
        } else if (gpio == BTN_PIN_AZUL) {
            btn_flag_azul = 0;
        } else if (gpio == BTN_PIN_AMARELO) {
            btn_flag_amarelo = 0;
        } else if (gpio == BTN_START){
            btn_flag_start = 0;
        }
    }
}

// Function to play a tone on the buzzer
void toca(int frequencia, int duracao, int pino) {
    int periodo = 1000000 / frequencia;
    int meio_periodo = periodo / 2;
    int ciclos = (duracao * 1000) / periodo;

    for (int i = 0; i < ciclos; i++) {
        gpio_put(pino, 1);
        sleep_us(meio_periodo);
        gpio_put(pino, 0);
        sleep_us(meio_periodo);
    }
}

// Mario main theme melody
const int melody[] = {
    NOTE_E7, NOTE_E7, 0, NOTE_E7,
    0, NOTE_C7, NOTE_E7, 0,
    NOTE_G7, 0, 0,  0,
    NOTE_G6, 0, 0, 0,
    NOTE_C7, 0, 0, NOTE_G6,
    0, 0, NOTE_E6, 0,
    0, NOTE_A6, 0, NOTE_B6,
    0, NOTE_AS6, NOTE_A6, 0,
    NOTE_G6, NOTE_E7, NOTE_G7,
    NOTE_A7, 0, NOTE_F7, NOTE_G7,
    0, NOTE_E7, 0, NOTE_C7,
    NOTE_D7, NOTE_B6, 0, 0
};

// Mario main theme tempo
const int tempo[] = {
    12, 12, 12, 12,
    12, 12, 12, 12,
    12, 12, 12, 12,
    12, 12, 12, 12,
    12, 12, 12, 12,
    12, 12, 12, 12,
    12, 12, 12, 12,
    9, 9, 9,
    12, 12, 12, 12,
    12, 12, 12, 12,
    12, 12, 12, 12
};

const int powerup_mario_melody[] = {
    NOTE_E5, NOTE_G5, NOTE_E6, NOTE_C6, NOTE_D6, NOTE_G6
};
const int powerup_mario_tempo[] = {
    12, 12, 12, 12, 12, 12
};

// Bandeira final melody
const int victory_melody[] = {
    NOTE_E5, NOTE_E5, NOTE_E5,
    NOTE_C5, NOTE_E5, NOTE_G5, NOTE_G4, 0,
    NOTE_C5, NOTE_G4, NOTE_E4, NOTE_A4, NOTE_B4, NOTE_AS4, NOTE_A4,
    NOTE_G4, NOTE_E5, NOTE_G5, NOTE_A5, NOTE_F5, NOTE_G5,
    NOTE_E5, NOTE_C5, NOTE_D5, NOTE_B4
};

const int victory_tempo[] = {
    12, 12, 12,
    12, 12, 12, 12, 24,
    12, 12, 12, 12, 12, 12, 12,
    12, 12, 12, 12, 12, 12,
    12, 12, 12, 12
};


// Função para tocar a música do Mario com LEDs sincronizados
void playMarioThemeWithLEDs(int buzzerPin, const int* ledPins, int numLeds) {
    int size = sizeof(melody) / sizeof(int);
    for (int thisNote = 0; thisNote < size; thisNote++) {
        int noteDuration = 1000 / tempo[thisNote];
        toca(melody[thisNote], noteDuration, buzzerPin);

        // Acende todos os LEDs simultaneamente com a nota
        for (int i = 0; i < numLeds; i++) {
            gpio_put(ledPins[i], 1);
        }

        int pauseBetweenNotes = noteDuration * 1.30;
        sleep_ms(pauseBetweenNotes);

        // Apaga todos os LEDs após a nota
        for (int i = 0; i < numLeds; i++) {
            gpio_put(ledPins[i], 0);
        }
    }

    // Acende todos os LEDs após a música terminar
    for (int i = 0; i < numLeds; i++) {
        gpio_put(ledPins[i], 1);
    }
    sleep_ms(1000);
    for (int i = 0; i < numLeds; i++) {
        gpio_put(ledPins[i], 0);
    }
}

void playSound(const int* melody, const int* tempo, int size, int buzzerPin) {
    for (int thisNote = 0; thisNote < size; thisNote++) {
        int noteDuration = 1000 / tempo[thisNote];
        toca(melody[thisNote], noteDuration, buzzerPin);
        int pauseBetweenNotes = noteDuration * 1.30;
        sleep_ms(pauseBetweenNotes);
    }
}

void toca_continuo(int frequencia, int pino) {
    int periodo = 1000000 / frequencia;
    int meio_periodo = periodo / 2;

    for (int i = 0; i < 200; i++) {
        gpio_put(pino, 1);
        sleep_us(meio_periodo);
        gpio_put(pino, 0);
        sleep_us(meio_periodo);
    }
}

void playErrorSound(int buzzerPin) {
    toca_continuo(LOW_ERROR_NOTE, buzzerPin);
}

void blinkLedsSlowly(const int* ledPins, int numLeds) {
    for (int i = 0; i < numLeds; i++) {
        gpio_put(ledPins[i], 1);
    }
    sleep_ms(500);
    for (int i = 0; i < numLeds; i++) {
        gpio_put(ledPins[i], 0);
    }
    sleep_ms(500);
}

void init_random() {
    uint32_t seed = systick_hw->cvr ^ (uint32_t)time_us_64() ^ (uintptr_t)&seed;
    srand(seed);
}

int gera_numero_aleatorio() {
    return rand() % 4;
}

int main() {
    int frequencia_vermelho = 330;
    int frequencia_verde = 262;
    int frequencia_amarelo = 392;
    int frequencia_azul = 523;
    int duracao = 500;
    int pontuacao = 0;
    int recorde = read_score();

    stdio_init_all();
    gpio_init(BTN_PIN_VERMELHO);
    gpio_init(BTN_PIN_AZUL);
    gpio_init(BTN_PIN_VERDE);
    gpio_init(BTN_PIN_AMARELO);
    gpio_init(BTN_START);
    gpio_init(BUZZER_PIN);
    gpio_init(LED_PIN_VERMELHO);
    gpio_init(LED_PIN_AZUL);
    gpio_init(LED_PIN_VERDE);
    gpio_init(LED_PIN_AMARELO);

    gpio_set_dir(BTN_PIN_VERMELHO, GPIO_IN);
    gpio_set_dir(BTN_PIN_AZUL, GPIO_IN);
    gpio_set_dir(BTN_PIN_VERDE, GPIO_IN);
    gpio_set_dir(BTN_PIN_AMARELO, GPIO_IN);
    gpio_set_dir(BTN_START, GPIO_IN);
    gpio_set_dir(BUZZER_PIN, GPIO_OUT);
    gpio_set_dir(LED_PIN_VERMELHO, GPIO_OUT);
    gpio_set_dir(LED_PIN_AZUL, GPIO_OUT);
    gpio_set_dir(LED_PIN_VERDE, GPIO_OUT);
    gpio_set_dir(LED_PIN_AMARELO, GPIO_OUT);

    gpio_pull_up(BTN_PIN_VERMELHO);
    gpio_pull_up(BTN_PIN_AZUL);
    gpio_pull_up(BTN_PIN_AMARELO);
    gpio_pull_up(BTN_PIN_VERDE);
    gpio_pull_up(BTN_START);

    gpio_set_irq_enabled_with_callback(BTN_PIN_VERMELHO, GPIO_IRQ_EDGE_FALL, true, &btn_callback);
    gpio_set_irq_enabled_with_callback(BTN_PIN_AZUL, GPIO_IRQ_EDGE_FALL, true, &btn_callback);
    gpio_set_irq_enabled_with_callback(BTN_PIN_VERDE, GPIO_IRQ_EDGE_FALL, true, &btn_callback);
    gpio_set_irq_enabled_with_callback(BTN_PIN_AMARELO, GPIO_IRQ_EDGE_FALL, true, &btn_callback);
    gpio_set_irq_enabled_with_callback(BTN_START, GPIO_IRQ_EDGE_FALL, true, &btn_callback);
    printf("Interrupções configuradas\n");

    // Inicialização do I2C e detecção do endereço do LCD
    lcd_init(0x27, LCD_COLUMNS, LCD_ROWS, I2C_PORT, SDA_PIN, SCL_PIN);  // Inicializa o LCD com o endereço padrão 0x27
    printf("LCD inicializado\n");

    lcd_clear();
    lcd_printf("Iniciando...");  // Imprime "Iniciando..."

    init_random();

    // Tocar a música do Mario com LEDs sincronizados
    const int ledPins[] = {LED_PIN_VERMELHO, LED_PIN_AZUL, LED_PIN_VERDE, LED_PIN_AMARELO};
    playMarioThemeWithLEDs(BUZZER_PIN, ledPins, 4);

    const int arrays_cores[] = {BTN_PIN_VERMELHO, BTN_PIN_AZUL, BTN_PIN_VERDE, BTN_PIN_AMARELO};
    const int arrays_frequencias[] = {frequencia_vermelho, frequencia_azul, frequencia_verde, frequencia_amarelo};
    const int arrays_leds[] = {LED_PIN_VERMELHO, LED_PIN_AZUL, LED_PIN_VERDE, LED_PIN_AMARELO};

    int array_resp_correta[200];
    int array_num_gerados[200];
    int i = 0;
    int count_jogo = 0;

    while (true) {
        printf("Entrei no while\n");

        if (btn_flag_start == -1) {
            lcd_clear();
            lcd_set_cursor(0, 0);
            lcd_printf("Recorde: %d", recorde);
            sleep_ms(1000);
            blinkLedsSlowly(ledPins, 4);
            lcd_clear();  // Limpa o display
            lcd_set_cursor(0, 1);  // Move o cursor para a primeira linha
            lcd_printf("Aperte o botao");  // Instrução inicial
            lcd_set_cursor(1, 0);  // Segunda linha
            lcd_printf("preto para jogar");
            sleep_ms(1500);
            
            memset(array_resp_correta, 0, sizeof(array_resp_correta));
            memset(array_num_gerados, 0, sizeof(array_num_gerados));
            i = 0;           // Reinicia o índice
            count_jogo = 0;   // Reinicia o contador do jogo
            duracao = 500;
            btn_flag_amarelo = -1;
            btn_flag_azul = -1;
            btn_flag_verde = -1;
            btn_flag_vermelho = -1; 
        }

        if (btn_flag_start == 0) {           
            lcd_clear();
            if (i==0){
            lcd_printf("3");
            sleep_ms(1000);
            lcd_clear();
            lcd_printf("2");
            sleep_ms(1000);
            lcd_clear();
            lcd_printf("1");
            sleep_ms(1000);
            lcd_clear();
            }
            lcd_printf("Jogando...");
            sleep_ms(1000);

            
            init_random();  // Reinitialize random seed before each round to ensure randomness
            int resp = gera_numero_aleatorio();
            array_num_gerados[i] = resp;
            array_resp_correta[i] = arrays_cores[resp];
            

            for(int n = 0; n < i + 1; n++) {
                gpio_put(arrays_leds[array_num_gerados[n]], 1);
                toca(arrays_frequencias[array_num_gerados[n]], duracao, BUZZER_PIN);
                sleep_ms(100);
                gpio_put(arrays_leds[array_num_gerados[n]], 0);
                sleep_ms(100);
                btn_flag_amarelo = -1;
                btn_flag_azul = -1;
                btn_flag_verde = -1;
                btn_flag_vermelho = -1; 
            }

            uint32_t start_ms = to_ms_since_boot(get_absolute_time()) + 4000;
            int last_displayed_second = -1;

            while(count_jogo <= i && btn_flag_start == 0) {
                uint32_t remaining_time = start_ms - to_ms_since_boot(get_absolute_time());
    
                if (remaining_time > 4000) {
                    remaining_time = 0;
                }

                int current_second = remaining_time / 1000;

                // Só atualiza o display se o segundo atual for diferente do último exibido
                if (current_second != last_displayed_second) {
                    lcd_clear();
                    lcd_set_cursor(0, 0);
                    lcd_printf("Tempo: %d", current_second);

                    last_displayed_second = current_second;
                }

                if (remaining_time == 0) {
                    playErrorSound(BUZZER_PIN);
                    lcd_clear();
                    lcd_printf("Tempo esgotado!");
                    sleep_ms(2000);
                    lcd_clear();
                    lcd_printf("Pontos: %d", pontuacao);          
                    sleep_ms(2000);
                    if (pontuacao > recorde) {
                        save_score(pontuacao);
                        recorde = pontuacao;
                        lcd_clear();
                        lcd_printf("Novo Recorde!");
                        playSound(victory_melody, victory_tempo, sizeof(victory_melody) / sizeof(int), BUZZER_PIN);  // Toca a música da bandeira
                        sleep_ms(2000);
                    }
                    pontuacao = 0;
                    btn_flag_start = -1;
                    break;
                }

                if (btn_flag_amarelo == 0) {
                    start_ms = to_ms_since_boot(get_absolute_time()) + 4000;
                    gpio_put(LED_PIN_AMARELO, 1);
                    toca(frequencia_amarelo, duracao, BUZZER_PIN);
                    sleep_ms(100);
                    gpio_put(LED_PIN_AMARELO, 0);
                    sleep_ms(100);
                    if (array_resp_correta[count_jogo] == BTN_PIN_AMARELO) {
                        count_jogo++;
                        btn_flag_amarelo = -1;
                    } else {
                        playErrorSound(BUZZER_PIN);
                        lcd_clear();
                        lcd_printf("Errou! Final: %d", pontuacao);
                        sleep_ms(5000);
                        if (pontuacao > recorde) {
                            save_score(pontuacao);
                            recorde = pontuacao;
                            lcd_clear();
                            lcd_printf("Novo Recorde!");
                            playSound(victory_melody, victory_tempo, sizeof(victory_melody) / sizeof(int), BUZZER_PIN);  // Toca a música da bandeira
                            sleep_ms(2000);
                        }
                        pontuacao = 0;
                        btn_flag_amarelo = -1;
                        btn_flag_start = -1;
                    }
                } 
                // Repita a lógica acima para os outros botões
                else if (btn_flag_azul == 0) {
                    start_ms = to_ms_since_boot(get_absolute_time()) + 4000;
                    gpio_put(LED_PIN_AZUL, 1);
                    toca(frequencia_azul, duracao, BUZZER_PIN);
                    sleep_ms(100);
                    gpio_put(LED_PIN_AZUL, 0);
                    sleep_ms(100);
                    if (array_resp_correta[count_jogo] == BTN_PIN_AZUL) {
                        count_jogo++;
                        btn_flag_azul = -1;
                    } else {
                        playErrorSound(BUZZER_PIN);
                        lcd_clear();
                        lcd_printf("Errou! Final: %d", pontuacao);
                        sleep_ms(5000);
                        if (pontuacao > recorde) {
                            save_score(pontuacao);
                            recorde = pontuacao;
                            lcd_clear();
                            lcd_printf("Novo Recorde!");
                            playSound(victory_melody, victory_tempo, sizeof(victory_melody) / sizeof(int), BUZZER_PIN);  // Toca a música da bandeira
                            sleep_ms(2000);
                        }
                        pontuacao = 0;
                        btn_flag_azul = -1;
                        btn_flag_start = -1;
                    }
                } 
                else if (btn_flag_verde == 0) {
                    start_ms = to_ms_since_boot(get_absolute_time()) + 4000;
                    gpio_put(LED_PIN_VERDE, 1);
                    toca(frequencia_verde, duracao, BUZZER_PIN);
                    sleep_ms(100);
                    gpio_put(LED_PIN_VERDE, 0);
                    sleep_ms(100);
                    if (array_resp_correta[count_jogo] == BTN_PIN_VERDE) {
                        
                        count_jogo++;
                        btn_flag_verde = -1;
                    } else {
                        playErrorSound(BUZZER_PIN);
                        lcd_clear();
                        lcd_printf("Errou! Final: %d", pontuacao);
                        sleep_ms(5000);
                        if (pontuacao > recorde) {
                            save_score(pontuacao);
                            recorde = pontuacao;
                            lcd_clear();
                            lcd_printf("Novo Recorde!");
                            playSound(victory_melody, victory_tempo, sizeof(victory_melody) / sizeof(int), BUZZER_PIN);  // Toca a música da bandeira
                            sleep_ms(2000);
                        }
                        pontuacao = 0;
                        btn_flag_verde = -1;
                        btn_flag_start = -1;
                    }
                } 
                else if (btn_flag_vermelho == 0) {
                    start_ms = to_ms_since_boot(get_absolute_time()) + 4000;
                    gpio_put(LED_PIN_VERMELHO, 1);
                    toca(frequencia_vermelho, duracao, BUZZER_PIN);
                    sleep_ms(100);
                    gpio_put(LED_PIN_VERMELHO, 0);
                    sleep_ms(100);
                    if (array_resp_correta[count_jogo] == BTN_PIN_VERMELHO) {
                        count_jogo++;
                        btn_flag_vermelho = -1;
                    } else {
                        playErrorSound(BUZZER_PIN);
                        lcd_clear();
                        lcd_printf("Errou! Final: %d", pontuacao);
                        sleep_ms(5000);
                        if (pontuacao > recorde) {
                            save_score(pontuacao);
                            recorde = pontuacao;
                            lcd_clear();
                            lcd_printf("Novo Recorde!");
                            playSound(victory_melody, victory_tempo, sizeof(victory_melody) / sizeof(int), BUZZER_PIN);  // Toca a música da bandeira
                            sleep_ms(2000);
                        }
                        pontuacao = 0;
                        btn_flag_vermelho = -1;
                        btn_flag_start = -1;
                    }
                }
            }
            if (btn_flag_start == 0) {
                playSound(powerup_mario_melody, powerup_mario_tempo, sizeof(powerup_mario_melody) / sizeof(int), BUZZER_PIN);
                pontuacao++;
                lcd_clear();
                lcd_printf("Acertou! Pts: %d", pontuacao);
                sleep_ms(1000);
            }
            
            duracao = duracao - 15;
            count_jogo = 0;
            i++;
        }
    }
}
