import requests
import datetime
from pymongo import MongoClient
import time

client = MongoClient("mongodb://admin:semeolvidoperolavoyacambiar@159.223.158.140:27017/tic3?authSource=admin")
db = client["tic3"]

token = ""
instance = ""

citas = {}

def getCitas():
    col = db["citas"]
    c = col.find({"estado":"Pendiente","fecha": {"$in": [(datetime.datetime.today()).date().strftime("%d/%m/%Y"),(datetime.datetime.today()+datetime.timedelta(days=1)).date().strftime("%d/%m/%Y")] }})
    
    for i in c:
        if(not(i["_id"] in citas)):
            citas[i["_id"]] = {"name": i["nombre"],
                               "fecha": i["fecha"],
                               "hora": i["hora"],
                               "phone": i["telefono"],
                               "time_s": 0
                               }

#"56976208379@c.us"
def getMessage(id):
    url = "https://api.ultramsg.com/"+instance+"/chats/messages"

    querystring = {"token":token,"chatId":id,"limit":"1"}

    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("GET", url, headers=headers, params=querystring)
    #if(response.json()['from'] != "56976072746@c.us"):
    print("Respuesta: ",response.json()[0]['body'].lower())
    
    if(len(response.json()[0]['body']) < 20):
        try:
            m = response.json()[0]["body"].lower()
            if("no" in m or "no confirmo" in m):
                return "cancelar"
            elif("si" in m or "confirmo" in m):
                return "confirmar"
        except:
            return "nada"
        
    return "nada"
    
def sendUbication(number):
    url = "https://api.ultramsg.com/"+instance+"/messages/location"

    payload = "token="+token+"&to="+number+"&address=Gracias por la confirmacion de su hora, recuerde que la sesion se realiza en la siguiente ubicacion: \nGuardia Vieja 255, Oficina 711&lat=-33.42440759623133&lng=-70.61053280674724&referenceId="
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)
    

def sendMessage(number,nombre,fecha,hora):
    url = "https://api.ultramsg.com/"+instance+"/messages/chat"

    payload = "token="+token+"&to="+number+"&body= Estimado "+nombre+", le enviamos este mensaje para solicitar la confirmacion de su asistencia a la sesion del dia "+fecha+" a las "+hora+" hrs. \nResponda con 'Si'/'Confirmo' o 'No'/'No Confirmo'. &priority=1&referenceId="
    
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)

    #print(response.text)

#print(response.json()[0]["body"])

getCitas()
while(True):
    for k in citas.keys():
        #ecancelar cita que pase el tiempo definido
        if(citas[k]["time_s"] != 0):
            #print(citas[k]["phone"][1:])
            v = getMessage(citas[k]["phone"][1:]+"@c.us")
            print(v)
            if(v == "confirmar"):
                col = db["citas"]
                col.find_one_and_update({"_id":k},{"$set":{"estado":"Confirmada"}})
                sendUbication(citas[k]["phone"])
                citas.pop(k)
                break
            elif(v == "cancelar"):
                col = db["citas"]
                col.find_one_and_update({"_id":k},{"$set":{"estado":"Cancelada"}})
                citas.pop(k)
                break
                
            if((datetime.datetime.now().timestamp() - citas[k]["time_s"]) > 24*3600):
                col = db["citas"]
                col.find_one_and_update({"_id":k},{"estado":"Cancelada"})
                citas.pop(k)
                break
    
        if(citas[k]["time_s"] == 0):
            sendMessage(citas[k]["phone"],citas[k]["name"],citas[k]["fecha"],citas[k]["hora"])
            citas[k]["time_s"] = datetime.datetime.now().timestamp()
            
    #datetime.timestamp(datetime.now())
    time.sleep(60)
    getCitas()
    
