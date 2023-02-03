import { Component } from '@angular/core';
import { collection, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';
import { BackendServiceFB } from '../backend-service.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent {

  public gameCollection: CollectionReference<DocumentData>;
  
  constructor(private readonly firestore: Firestore, public router: Router, public readonly backend: BackendServiceFB) {
    this.gameCollection = collection(this.firestore, 'game');
  }

  /**
   * @description
   * creates new Game Instance and copies it to the backend using the addData() method from the backend service
   * some additional functionality is nested in the method ( not ideal )
   */
  addNewGame() {
    let game = new Game();
    this.backend.addData(game);
  }
}