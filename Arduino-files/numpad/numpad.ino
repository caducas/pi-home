// Paint example specifically for the TFTLCD breakout board.
// If using the Arduino shield, use the tftpaint_shield.pde sketch instead!
// DOES NOT CURRENTLY WORK ON ARDUINO LEONARDO

#include <Adafruit_GFX.h>    // Core graphics library
#include <Adafruit_TFTLCD.h> // Hardware-specific library
#include <TouchScreen.h>

#if defined(__SAM3X8E__)
    #undef __FlashStringHelper::F(string_literal)
    #define F(string_literal) string_literal
#endif

// When using the BREAKOUT BOARD only, use these 8 data lines to the LCD:
// For the Arduino Uno, Duemilanove, Diecimila, etc.:
//   D0 connects to digital pin 8  (Notice these are
//   D1 connects to digital pin 9   NOT in order!)
//   D2 connects to digital pin 2
//   D3 connects to digital pin 3
//   D4 connects to digital pin 4
//   D5 connects to digital pin 5
//   D6 connects to digital pin 6
//   D7 connects to digital pin 7

// For the Arduino Mega, use digital pins 22 through 29
// (on the 2-row header at the end of the board).
//   D0 connects to digital pin 22
//   D1 connects to digital pin 23
//   D2 connects to digital pin 24
//   D3 connects to digital pin 25
//   D4 connects to digital pin 26
//   D5 connects to digital pin 27
//   D6 connects to digital pin 28
//   D7 connects to digital pin 29

// For the Arduino Due, use digital pins 33 through 40
// (on the 2-row header at the end of the board).
//   D0 connects to digital pin 33
//   D1 connects to digital pin 34
//   D2 connects to digital pin 35
//   D3 connects to digital pin 36
//   D4 connects to digital pin 37
//   D5 connects to digital pin 38
//   D6 connects to digital pin 39
//   D7 connects to digital pin 40

#define YP A3  // must be an analog pin, use "An" notation!
#define XM A2  // must be an analog pin, use "An" notation!
#define YM 9   // can be a digital pin
#define XP 8   // can be a digital pin

#define TS_MINX 150
#define TS_MINY 120
#define TS_MAXX 920
#define TS_MAXY 940

// For better pressure precision, we need to know the resistance
// between X+ and X- Use any multimeter to read it
// For the one we're using, its 300 ohms across the X plate
TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);

#define LCD_CS A3
#define LCD_CD A2
#define LCD_WR A1
#define LCD_RD A0
// optional
#define LCD_RESET A4

// Assign human-readable names to some common 16-bit color values:
#define	BLACK   0x0000
#define	BLUE    0x001F
#define	RED     0xF800
#define	GREEN   0x07E0
#define CYAN    0x07FF
#define MAGENTA 0xF81F
#define YELLOW  0xFFE0
#define WHITE   0xFFFF


Adafruit_TFTLCD tft(LCD_CS, LCD_CD, LCD_WR, LCD_RD, LCD_RESET);

#define BOXSIZE 40
#define NUMPAD_PIXEL_HEIGHT tft.height()
#define NUMPAD_PIXEL_WIDTH tft.width()
#define NUMPAD_KEY_WIDTH NUMPAD_PIXEL_WIDTH/3
#define NUMPAD_KEY_HEIGHT NUMPAD_PIXEL_HEIGHT/4
#define NUMPAD_CANCEL_WIDTH NUMPAD_KEY_WIDTH
#define NUMPAD_OK_WIDTH NUMPAD_KEY_WIDTH*2
#define NUMPAD_KEY_COLOR WHITE
#define PENRADIUS 3

#define PASSWORD_STARTING_VALUE "*"
#define PASSWORD_ENDING_VALUE "#"
int oldcolor, currentcolor;

void setup(void) {
  Serial.begin(9600);
  Serial.println(F("Paint!"));
  
  tft.reset();
  
  uint16_t identifier = tft.readID();

  if(identifier == 0x9325) {
    Serial.println(F("Found ILI9325 LCD driver"));
  } else if(identifier == 0x9328) {
    Serial.println(F("Found ILI9328 LCD driver"));
  } else if(identifier == 0x7575) {
    Serial.println(F("Found HX8347G LCD driver"));
  } else {
    Serial.print(F("Unknown LCD driver chip: "));
    Serial.println(identifier, HEX);
    return;
  }

  tft.begin(identifier);
  
  drawNumpad();
}

#define MINPRESSURE 10
#define MAXPRESSURE 1000

String keyInput = PASSWORD_STARTING_VALUE;
int latestPressed = 0;

void loop()
{
  digitalWrite(13, HIGH);
  Point p = ts.getPoint();
  digitalWrite(13, LOW);

  // if sharing pins, you'll need to fix the directions of the touchscreen pins
  //pinMode(XP, OUTPUT);
  pinMode(XM, OUTPUT);
  pinMode(YP, OUTPUT);
  //pinMode(YM, OUTPUT);

  // we have some minimum pressure we consider 'valid'
  // pressure of 0 means no pressing!


  if (p.z > MINPRESSURE && p.z < MAXPRESSURE) {
    
    p.x = map(p.x, TS_MINX, TS_MAXX, tft.width(), 0);
    p.y = map(p.y, TS_MINY, TS_MAXY, tft.height(), 0);
    
    if(p.x >= 0 && p.x < NUMPAD_CANCEL_WIDTH && p.y >= NUMPAD_KEY_HEIGHT*3 && p.y < NUMPAD_PIXEL_HEIGHT) {
      keyInput = PASSWORD_STARTING_VALUE;
      drawNumpadFeedback(RED);
      return;
    }
    if(p.x >= NUMPAD_CANCEL_WIDTH && p.x < NUMPAD_PIXEL_WIDTH && p.y >= NUMPAD_KEY_HEIGHT*3 && p.y < NUMPAD_PIXEL_HEIGHT && keyInput.length()>0) {
      keyInput = keyInput + PASSWORD_ENDING_VALUE;
      Serial.println(keyInput);
      keyInput = PASSWORD_STARTING_VALUE;
      drawNumpadFeedback(GREEN);
      return;
    }
    
    for(int i = 0; i<10; i++) {
      int pos_X = NUMPAD_KEY_WIDTH*(i%3);
      int pos_Y = NUMPAD_KEY_HEIGHT*(i/3);
      if(p.x >= pos_X && p.x < (pos_X + NUMPAD_KEY_WIDTH) && p.y >= pos_Y && p.y < (pos_Y + NUMPAD_KEY_HEIGHT)) {
        
    
        int position_X = NUMPAD_KEY_WIDTH*(i%3);
        int position_Y = NUMPAD_KEY_HEIGHT*(i/3);
    
        tft.fillRect(position_X, position_Y, NUMPAD_KEY_WIDTH, NUMPAD_KEY_HEIGHT, WHITE);
        tft.setCursor(position_X + (NUMPAD_KEY_WIDTH-26)/2, position_Y + (NUMPAD_KEY_HEIGHT-40)/2);
        tft.setTextColor(BLACK);
        tft.setTextSize(5);
        tft.print(i+1);
        
        latestPressed = i+1;
        
        String checkString = String(i+1);
        if(keyInput.length() == 0 || !keyInput.endsWith(checkString)) {
          keyInput = keyInput + (i+1);
          drawNumpadFeedback(WHITE);
        }
      }
    }
  }
}

void drawNumpadFeedback(uint16_t color) {
  tft.fillScreen(color);
  
  drawNumpad();
}
  
void drawNumpad() {

  tft.fillScreen(BLACK);
  for(int i = 0; i < 9; i++) {
    
    int pos_X = NUMPAD_KEY_WIDTH*(i%3);
    int pos_Y = NUMPAD_KEY_HEIGHT*(i/3);
    
    tft.drawRect(pos_X, pos_Y, NUMPAD_KEY_WIDTH, NUMPAD_KEY_HEIGHT, NUMPAD_KEY_COLOR);
    tft.setCursor(pos_X + (NUMPAD_KEY_WIDTH-26)/2, pos_Y + (NUMPAD_KEY_HEIGHT-40)/2);
    tft.setTextColor(WHITE);
    tft.setTextSize(5);
    tft.print(i+1);
    
  }
  
  int pos_X = 0;
  int pos_Y = NUMPAD_KEY_HEIGHT*3;
  tft.drawRect(pos_X, pos_Y, NUMPAD_CANCEL_WIDTH, NUMPAD_KEY_HEIGHT, WHITE);
  tft.setCursor(pos_X + (NUMPAD_CANCEL_WIDTH-26)/2, pos_Y + (NUMPAD_KEY_HEIGHT-40)/2);
  tft.setTextColor(RED);
  tft.setTextSize(5);
  tft.print("X");
  
  pos_X = NUMPAD_CANCEL_WIDTH;
  tft.drawRect(pos_X, pos_Y, NUMPAD_OK_WIDTH, NUMPAD_KEY_HEIGHT, WHITE);
  tft.setCursor(pos_X + (NUMPAD_OK_WIDTH-26)/2, pos_Y + (NUMPAD_KEY_HEIGHT-40)/2);
  tft.setTextColor(GREEN);
  tft.setTextSize(5);
  tft.print("OK");  

  pinMode(13, OUTPUT);
}

void paintKey(int key) {
    latestPressed = 0;
    int i = key -1;
  
    int pos_X = NUMPAD_KEY_WIDTH*(i%3);
    int pos_Y = NUMPAD_KEY_HEIGHT*(i/3);
    tft.fillRect(pos_X, pos_Y, NUMPAD_KEY_WIDTH, NUMPAD_KEY_HEIGHT, BLACK);
    tft.drawRect(pos_X, pos_Y, NUMPAD_KEY_WIDTH, NUMPAD_KEY_HEIGHT, NUMPAD_KEY_COLOR);
    tft.setCursor(pos_X + (NUMPAD_KEY_WIDTH-26)/2, pos_Y + (NUMPAD_KEY_HEIGHT-40)/2);
    tft.setTextColor(WHITE);
    tft.setTextSize(5);
    tft.print(i+1);
}
