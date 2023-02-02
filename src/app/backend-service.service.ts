import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, doc, docData, DocumentData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Game } from 'src/models/game';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceFB {
  public game: Game = new Game();
  public gameID: string;
  public gameCollection: CollectionReference<DocumentData>;
  
  constructor(private readonly firestore: Firestore) {
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


  updateGame() {
    const gameDocumentReference = doc(this.firestore, 'game', this.gameID);
    return updateDoc(gameDocumentReference, this.game.toJson());
  }
}
