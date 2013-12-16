/*	
	Copyright 2012 CurlyMo
	
	This file is part of the Raspberry Pi 433.92Mhz transceiver.

    Raspberry Pi 433.92Mhz transceiver is free software: you can redistribute 
	it and/or modify it under the terms of the GNU General Public License as 
	published by the Free Software Foundation, either version 3 of the License, 
	or (at your option) any later version.

    Raspberry Pi 433.92Mhz transceiver is distributed in the hope that it will 
	be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Raspberry Pi 433.92Mhz transceiver. If not, see 
	<http://www.gnu.org/licenses/>
*/

#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <getopt.h>
#include <unistd.h>
#include <ctype.h>
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <bitset>
#include <limits>
#include <time.h>

using namespace std;

string code;
string binary;
vector<string> acode;

int crossing = 10;
int end = 100;
int marge = 5;
int start = 30;
int speed = 50;
int x = 0;
int bit = 2;
int type = 0;

string itos(int i) {
    ostringstream s;
    s << i;
    return s.str();
}

vector<string> explode( const string &delimiter, const string &str)
{
    vector<string> arr;

    int strleng = str.length();
    int delleng = delimiter.length();
    if (delleng==0)
        return arr;//no change

    int i=0;
    int k=0;
    while( i<strleng )
    {
        int j=0;
        while (i+j<strleng && j<delleng && str[i+j]==delimiter[j])
            j++;
        if (j==delleng)//found delimiter
        {
            arr.push_back(  str.substr(k, i-k) );
            i+=delleng;
            k=i;
        }
        else
        {
            i++;
        }
    }
    arr.push_back(  str.substr(k, i-k) );
    return arr;
}


void createBinaryString(int cutoff) {
	int a = 0;
	string id;
	int record  = 0;
	for(a=0;a<(int)acode.size();a+=4) {
		if(atoi(acode[a+bit].c_str()) > crossing) {
			if((record == 1 && cutoff == 1) || cutoff == 0)
				binary.append("0");
		} else if(atoi(acode[a+bit].c_str()) < crossing) {
			record = 1;
			binary.append("1");
		}
	}
}



int main(int argc, char **argv) { 
	int pin_in;
	int read = 0;
	int one = 0;
	int zero = 0;
	int opt = 0;
	//int noCalc = 0;
	
	if(wiringPiSetup() == -1)
		return 0;
	piHiPri(99);

	while((opt = getopt(argc, argv, "p:dc")) != -1) {
		if(opt == 'p') {
				pin_in = atoi(optarg);
				printf("pin is set now\n");
		}
	}

	printf("is now %i",pin_in);
	
	pinMode(pin_in, INPUT);
	printf("Start\n");

	while(1) {
		usleep(speed);
		if(digitalRead(pin_in) == 1) {
			one++;
			 if(read == 1 && zero > 0) {
					code.append(itos(zero));
					code.append(";");
			}
			zero=0;
		}
		if(digitalRead(pin_in) == 0) {
			zero++;
			if(read == 1 && one > 0) {
					code.append(itos(one));
					code.append(";");
			}
			one=0;
		}
		if((zero >= (start-marge)) && (zero <= (start+marge)) && read == 0) {
			read = 1;			
			zero = 0;
			one = 0;
		}
		
		if(read == 1 && zero >= end) {
			read=0;
			
			acode = explode(";",code);
			
			switch((int)acode.size()) {
				case 133:
					type = 1;
				break;
				case 149:
					type = 2;
				break;
				case 51:
					type = 3;
					bit = 3;
				break;
				default:
					type = 0;
				break;
			}
			
			if(type > 0) {
				
				if(type == 1)
					x = 7;
				if(type == 2)
					x = 11;
				createBinaryString(0);
				switch((int)binary.length()) {
					case 34:
						type = 1;
					break;
					case 38:
						type = 2;
					break;
					case 13:
						type = 3;
					break;
					default:
						type = 0;
					break;
				}
				binary.clear();
				if(type == 1 || type == 2) {
					createBinaryString(1);
				} else if(type == 3) {
					createBinaryString(0);
				}
				
				if((int)binary.length() >= x) {
					printf("event");
					cout << binary << endl;
					
					usleep(5000);
				}	
			}
			type = 0;
			binary.clear();
			code.clear();
			acode.clear();							
			one=0;
			zero=0;
			x=0;
		}
	}
}
