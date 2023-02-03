import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, docData, DocumentData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceFB {
  public game: Game = new Game();
  public gameID: string;
  public gameCollection: CollectionReference<DocumentData>;
  
  constructor(private readonly firestore: Firestore, public router: Router) {
    this.gameCollection = collection(this.firestore, 'game');
   }


   /**
   *
   * @returns A collection of all game instances
   */
   getAll() {
    return collectionData(this.gameCollection).subscribe((game) => {
      console.log('Game update', game);
    });
  }


  /**
   *
   * @param id - Game instance id. Referrences the document id in the firestore database
   * @returns
   */
  get() {
    const gameDocumentReference = doc(this.firestore, 'game', this.gameID);
    //syncs game with database
    return docData(gameDocumentReference).subscribe((game: any) => {
      this.game.currentPlayer = game.currentPlayer;
      this.game.playedCards = game.playedCards;
      this.game.stack = game.stack;
      this.game.players = game.players;
      this.game.currentCard = game.currentCard;
      this.game.pickCardAnimation = game.pickCardAnimation;
    });
  }


  /**
   * Method to add data to the database
   * @description
   * 
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


  /**
  @function
  @description
  The method 'updateGame' updates the game document in Firestore.
  It retrieves a reference to the game document using the 'gameID' property and the 'doc' helper function.
  Then it updates the game document using the 'updateDoc' helper function and the game data in JSON format obtained from calling the 'toJson' method.
  @returns {firebase.firestore.WriteResult} - The result of the update operation.
  */
  updateGame() {
    const gameDocumentReference = doc(this.firestore, 'game', this.gameID);
    return updateDoc(gameDocumentReference, this.game.toJson());
  }
}
