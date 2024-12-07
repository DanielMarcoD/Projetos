/*
 * LED blink with FreeRTOS
 */
#include <FreeRTOS.h>
#include <task.h>
#include <semphr.h>
#include <queue.h>

#include <string.h>
#include "hardware/adc.h"
#include "hardware/uart.h"

#include "pico/stdlib.h"
#include <stdio.h>

#include "hc06.h"

#define UART_TX_PIN 0
#define UART_RX_PIN 1
#define BUTTON_1_PIN 14
#define BUTTON_2_PIN 2
#define BUTTON_3_PIN 8
#define BUTTON_4_PIN 13
#define BUTTON_5_PIN 10
#define BUTTON_6_PIN 21
#define LED_PIN 16
#define BUTTON_MACRO 15

QueueHandle_t xQueueAdc;
QueueHandle_t xQueueButtonEvents;
QueueHandle_t xQueueData1;
QueueHandle_t xQueueData2;
QueueHandle_t xQueueProcess1;
QueueHandle_t xQueueProcess2;

typedef struct {
    int axis;
    uint16_t val;  // Usa uint16_t para corresponder ao valor do ADC
} adc_t;

typedef struct {
    int button_id;
    int state;  // 1 para pressionado, 0 para liberado
} button_event_t;

void hc06_task(void *p) {
    adc_t data;

    uart_init(HC06_UART_ID, HC06_BAUD_RATE);
    gpio_set_function(HC06_TX_PIN, GPIO_FUNC_UART);
    gpio_set_function(HC06_RX_PIN, GPIO_FUNC_UART);
    hc06_init("brawlhalla", "1234");

    while (true) {
         if (xQueueReceive(xQueueAdc, &data, portMAX_DELAY)) {
            int16_t scaled_value = ((int32_t)(data.val - 2047) * 255) / 2047;
            if (scaled_value > 255) scaled_value = 255;
            if (scaled_value < -255) scaled_value = -255;
            if (scaled_value > -30 && scaled_value < 30) {
                scaled_value = 0;
            }

            uint8_t axis = data.axis;
            uint8_t msb, lsb;

            if (scaled_value < 0) {
                msb = 0xFF;
                scaled_value = -scaled_value;
                lsb = (uint8_t)scaled_value;
                lsb = ~lsb + 1;
            } else {
                msb = (scaled_value >> 8) & 0xFF;
                lsb = scaled_value & 0xFF;
            }

            uint8_t eop = 0xFF;
            uart_putc_raw(HC06_UART_ID, 0xAA);
            uart_putc_raw(HC06_UART_ID, axis);
            uart_putc_raw(HC06_UART_ID, msb);
            uart_putc_raw(HC06_UART_ID, lsb);
            uart_putc_raw(HC06_UART_ID, eop);
        }
    }

    
}

void hc06_task_2(void *p) {
    button_event_t button_data;

    // uart_init(HC06_UART_ID, HC06_BAUD_RATE);
    // gpio_set_function(HC06_TX_PIN, GPIO_FUNC_UART);
    // gpio_set_function(HC06_RX_PIN, GPIO_FUNC_UART);
    // hc06_init("brawlhalla", "1234");

    while (true) {
        if (xQueueReceive(xQueueButtonEvents, &button_data, portMAX_DELAY)) {
            uint8_t axis = button_data.button_id;
            uint8_t state = button_data.state;
            uint8_t eop = 0xFF;
            uart_putc_raw(HC06_UART_ID, 0xBB);
            uart_putc_raw(HC06_UART_ID, axis);
            uart_putc_raw(HC06_UART_ID, state);
            uart_putc_raw(HC06_UART_ID, 0);
            uart_putc_raw(HC06_UART_ID, eop);
        }
    }


    
}

void pin_callback(uint gpio, uint32_t events) {
    button_event_t btn_event;
    btn_event.state = !gpio_get(gpio);

    if (gpio == BUTTON_1_PIN) btn_event.button_id = 2;
    else if (gpio == BUTTON_2_PIN) {
        btn_event.button_id = 3;
        gpio_put(BUTTON_6_PIN, btn_event.state);
    } else if (gpio == BUTTON_3_PIN) btn_event.button_id = 4;
    else if (gpio == BUTTON_4_PIN) btn_event.button_id = 5;
    else if (gpio == BUTTON_5_PIN) btn_event.button_id = 6;
    else if (gpio == BUTTON_MACRO) btn_event.button_id = 7;
    else return;

    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    xQueueSendFromISR(xQueueButtonEvents, &btn_event, &xHigherPriorityTaskWoken);
    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}

void adc_1_task(void *p) {
    uint16_t result_adc1;
    uint16_t average;

    while (1) {
        adc_select_input(1);
        result_adc1 = adc_read();
        xQueueSend(xQueueData1, &result_adc1, portMAX_DELAY);

        if (xQueueReceive(xQueueProcess1, &average, portMAX_DELAY)) {
            adc_t data = {1, average};
            xQueueSend(xQueueAdc, &data, portMAX_DELAY);
        }

        vTaskDelay(pdMS_TO_TICKS(10));
    }
}

void adc_2_task(void *p) {
    uint16_t result_adc0;
    uint16_t average;

    while (1) {
        adc_select_input(0);
        result_adc0 = adc_read();
        xQueueSend(xQueueData2, &result_adc0, portMAX_DELAY);

        if (xQueueReceive(xQueueProcess2, &average, portMAX_DELAY)) {
            adc_t data = {0, average};
            xQueueSend(xQueueAdc, &data, portMAX_DELAY);
        }

        vTaskDelay(pdMS_TO_TICKS(10));
    }
}

void process_task_adc_1(void *p) {
    uint16_t data = 0;
    uint16_t array[5] = {0, 0, 0, 0, 0};
    int i = 0;

    while (1) {
        if (xQueueReceive(xQueueData1, &data, portMAX_DELAY)) {
            array[i] = data;
            i = (i + 1) % 5;

            uint32_t sum = 0;
            for (int j = 0; j < 5; j++) {
                sum += array[j];
            }
            uint16_t average = sum / 5;
            xQueueSend(xQueueProcess1, &average, portMAX_DELAY);

            vTaskDelay(pdMS_TO_TICKS(10));
        }
    }
}

void process_task_adc_2(void *p) {
    uint16_t data = 0;
    uint16_t array[5] = {0, 0, 0, 0, 0};
    int i = 0;

    while (1) {
        if (xQueueReceive(xQueueData2, &data, portMAX_DELAY)) {
            array[i] = data;
            i = (i + 1) % 5;

            uint32_t sum = 0;
            for (int j = 0; j < 5; j++) {
                sum += array[j];
            }
            uint16_t average = sum / 5;
            xQueueSend(xQueueProcess2, &average, portMAX_DELAY);

            vTaskDelay(pdMS_TO_TICKS(10));
        }
    }
}

int main() {
    stdio_init_all();

    uart_init(uart0, 115200);

    gpio_set_function(UART_TX_PIN, GPIO_FUNC_UART);
    gpio_set_function(UART_RX_PIN, GPIO_FUNC_UART);

    adc_init();
    adc_gpio_init(27);  // ADC1
    adc_gpio_init(26);  // ADC0

    gpio_init(BUTTON_1_PIN);
    gpio_init(BUTTON_2_PIN);
    gpio_init(BUTTON_3_PIN);
    gpio_init(BUTTON_4_PIN);
    gpio_init(BUTTON_5_PIN);
    gpio_init(BUTTON_6_PIN);
    gpio_init(BUTTON_MACRO);
    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);
    gpio_put(LED_PIN,1);
    gpio_set_dir(BUTTON_6_PIN, GPIO_OUT);
    gpio_set_dir(BUTTON_1_PIN, GPIO_IN);
    gpio_set_dir(BUTTON_2_PIN, GPIO_IN);
    gpio_set_dir(BUTTON_3_PIN, GPIO_IN);
    gpio_set_dir(BUTTON_4_PIN, GPIO_IN);
    gpio_set_dir(BUTTON_5_PIN, GPIO_IN);
    gpio_set_dir(BUTTON_MACRO, GPIO_IN);
    gpio_pull_up(BUTTON_1_PIN);
    gpio_pull_up(BUTTON_2_PIN);
    gpio_pull_up(BUTTON_3_PIN);
    gpio_pull_up(BUTTON_4_PIN);
    gpio_pull_up(BUTTON_5_PIN);
    gpio_pull_up(BUTTON_MACRO);

    gpio_set_irq_enabled_with_callback(BUTTON_1_PIN, GPIO_IRQ_EDGE_FALL | GPIO_IRQ_EDGE_RISE, true, &pin_callback);
    gpio_set_irq_enabled(BUTTON_2_PIN, GPIO_IRQ_EDGE_FALL | GPIO_IRQ_EDGE_RISE, true);
    gpio_set_irq_enabled(BUTTON_3_PIN, GPIO_IRQ_EDGE_FALL | GPIO_IRQ_EDGE_RISE, true);
    gpio_set_irq_enabled(BUTTON_4_PIN, GPIO_IRQ_EDGE_FALL | GPIO_IRQ_EDGE_RISE, true);
    gpio_set_irq_enabled(BUTTON_5_PIN, GPIO_IRQ_EDGE_FALL | GPIO_IRQ_EDGE_RISE, true);
    gpio_set_irq_enabled(BUTTON_MACRO, GPIO_IRQ_EDGE_FALL | GPIO_IRQ_EDGE_RISE, true);

    xQueueAdc = xQueueCreate(32, sizeof(adc_t));
    xQueueData1 = xQueueCreate(32, sizeof(uint16_t));
    xQueueData2 = xQueueCreate(32, sizeof(uint16_t));
    xQueueProcess1 = xQueueCreate(32, sizeof(uint16_t));
    xQueueProcess2 = xQueueCreate(32, sizeof(uint16_t));
    xQueueButtonEvents = xQueueCreate(32, sizeof(button_event_t));


    printf("Start bluetooth task\n");

    xTaskCreate(hc06_task, "UART_Task 1", 4096, NULL, 1, NULL);
    xTaskCreate(hc06_task_2, "hc06_task_2", 4096, NULL, 1, NULL);
    xTaskCreate(adc_1_task, "adc_1_task", 4096, NULL, 1, NULL);
    xTaskCreate(adc_2_task, "adc_2_task", 4096, NULL, 1, NULL);
    xTaskCreate(process_task_adc_1, "process_task_adc_1", 4096, NULL, 1, NULL);
    xTaskCreate(process_task_adc_2, "process_task_adc_2", 4096, NULL, 1, NULL);


    vTaskStartScheduler();

    while (true)
        ;
}