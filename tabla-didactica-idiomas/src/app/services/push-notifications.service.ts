import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Person } from '../classes/user/person';
import { INotification } from '../interfaces/iNotification';
import { CollectionsService } from './collections.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationsService {
  public token_phone = '';

  constructor(
    private collection: CollectionsService,
    private http: HttpClient
  ) {
    FirebaseMessaging.addListener('notificationReceived', (event) => {
      console.log('notificationReceived: ', { event });
    });
    FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
      console.log('notificationActionPerformed: ', { event });
    });
    if (Capacitor.getPlatform() === 'web') {
      navigator.serviceWorker.addEventListener('message', (event: any) => {
        console.log('serviceWorker message: ', { event });
        const notification = new Notification(event.data.notification.title, {
          body: event.data.notification.body,
        });
        notification.onclick = (event) => {
          console.log('notification clicked: ', { event });
        };
      });
    }

    this.requestPermissions();
  }

  public async requestPermissions(): Promise<void> {
    await FirebaseMessaging.requestPermissions();
  }

  public async getToken(): Promise<string> {
    const { token } = await FirebaseMessaging.getToken();
    console.log('token_phone');
    console.log(token);
    this.token_phone = token;
    return token;
  }
  /**
 
  async sendPushNotification(notification: INotification, person: Person) {

    if (person.token != undefined) {

      const payload = {
        message: {
          token: person.token,
          // token: this.token_phone, //envio a mi mismo
          notification: {
            title: notification.title,
            body: notification.description,
          }
        }
      };
      
      let TOKEN_AUTH: string = "";
      await this.collection.getOne("token", "H8ThBU1VBrsASblKvofZ").then(token => {
        TOKEN_AUTH = (token.docs[0].data()['access']);
      });

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + TOKEN_AUTH
        })
      }

      console.log('token_payload');
      console.log(person.token);

      console.log('TOKEN_AUTH');
      console.log(TOKEN_AUTH);


      this.http.post<Observable<any>>(environment.fcmUrl, payload, httpOptions)
      .pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
        console.error('There was an error!', error.message);
        return of();
    }))
    .subscribe(data => { console.log(data); });
    }
  }*/
}
