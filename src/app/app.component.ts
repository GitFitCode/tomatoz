import { Component } from '@angular/core';
import { firebase } from '@nativescript/firebase';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  async ngOnInit(): Promise<void> {
    try {
      await firebase.init({
        persist: true,
        storageBucket: 'gs://tomatoz-b343c.appspot.com'
      })
      console.log('>>>> Firebase initialization')
    } catch (err) {
      console.log('>>>>> Firebase init error' + err)
    }
  }
}
