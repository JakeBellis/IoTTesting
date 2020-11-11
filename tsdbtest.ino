// This #include statement was automatically added by the Particle IDE.
#include <HttpClient.h>  //for sending http data to the node server

// This #include statement was automatically added by the Particle IDE.
#include <Adafruit_DHT.h>


//const int DHT_DATA_PIN = D2; // RHT03 data pin

// Example testing sketch for various DHT humidity/temperature sensors
// Written by ladyada, public domain

#define DHTPIN 2   // what pin we're connected to

// Uncomment whatever type you're using!
//#define DHTTYPE DHT11		// DHT 11 
#define DHTTYPE DHT22		// DHT 22 (AM2302)
//#define DHTTYPE DHT21		// DHT 21 (AM2301)

// Connect pin 1 (on the left) of the sensor to +5V
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

DHT dht(DHTPIN, DHTTYPE);
String timeString = Time.timeStr();
double tempF = 0;
double humid = 0;
int unixTime = 0;
String deviceID = Particle.deviceID();  //id to send to cloud

HttpClient http;

// Headers currently need to be set at init, useful for API keys etc.
http_header_t headers[] = {
    //  { "Content-Type", "application/json" },
    //  { "Accept" , "application/json" },
    { "Accept" , "*/*"},
    { NULL, NULL } // NOTE: Always terminate headers will NULL
};

http_request_t request;
http_response_t response;
const char* formatString = "time=%d&id=%s&temp=%3.2f&humid=%2.2f";
char* postBodyPtr = (char*) malloc(100 * sizeof(char));


void setup()
{
	Serial.begin(9600); // Serial is used to print sensor readings.
	Serial.println("Begin Test:");
	Particle.variable("temperature", tempF);
	Particle.variable("humidity", humid);
	Particle.variable("time", timeString);
	Particle.variable("id", deviceID);
	dht.begin();
	request.hostname = X.X.X.X //insert server name
	request.port = 4040; //port of the Node js server
	request.path = "/test";
	
	
}

void loop()
{
    delay(5000); //delay 2 s between readings
    tempF = dht.getTempFarenheit();  //mispelled in header file which I don't want to change
    humid = dht.getHumidity();
    timeString = Time.timeStr();
    unixTime = Time.now(); //for putting data into database
    String postBody = String::format(formatString, unixTime, deviceID.c_str(), tempF, humid);
    request.body = postBody;
    
    http.post(request, response, headers);
    
    Serial.println(response.body);
    Serial.println();
    Serial.println(postBody);
    
    Serial.print("Temp: ");
    Serial.print(tempF);
    Serial.println("*F");
    Serial.print("Humid: "); 
	Serial.print(humid);
	Serial.println("%");
	Serial.println(timeString);
	Serial.println();
    
}