import { Component } from '@angular/core';
import { addDoc, collection, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';

import { ActivatedRoute, Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})

export class StartScreenComponent {

  public gameCollection: CollectionReference<DocumentData>;
  
  constructor(private readonly firestore: Firestore, private route: ActivatedRoute, private router: Router) {
    this.gameCollection = collection(this.firestore, 'game');
  }

  addNewGame() {
    let game = new Game();
    this.addData(game);
  }

  /**
   * Method to add data to the database
   */
  addData(game: any) {
    addDoc(this.gameCollection, game.toJson())
      .then((gameData: any) => {
        console.log('New Game created successfully');
        this.router.navigateByUrl('game/' + gameData.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
