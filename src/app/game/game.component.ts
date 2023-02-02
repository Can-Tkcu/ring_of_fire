import { Component, OnInit, Inject } from '@angular/core';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import {
  CollectionReference,
  DocumentData,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { ActivatedRoute } from '@angular/router';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { DialogEditPlayerComponent } from '../dialog-edit-player/dialog-edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
@Injectable({
  providedIn: 'root',
})
export class GameComponent implements OnInit {
  game: Game = new Game();
  gameID: string;

  public gameCollection: CollectionReference<DocumentData>;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private readonly firestore: Firestore
  ) {
    this.gameCollection = collection(this.firestore, 'game');
  }

  ngOnInit(): void {
    // this.newGame();
    this.route.params.subscribe((params) => {
      this.gameID = params['lobby'];
      this.get();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {});

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name)
        this.game.players.push(
          name.replace('<', '&gt').trim().replace('>', '&lt')
        );
      this.updateGame();
    });
  }

  editPlayer(ID: number) {
    const dialogRef = this.dialog.open(DialogEditPlayerComponent, {});
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change == 'DELETE') this.game.players.splice(ID, 1);
      this.updateGame();
    });
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop()!;
      this.updateGame();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      this.updateGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.updateGame();
      }, 1500);
    }
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
