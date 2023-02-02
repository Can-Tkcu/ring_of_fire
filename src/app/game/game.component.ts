import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { DialogEditPlayerComponent } from '../dialog-edit-player/dialog-edit-player.component';
import { BackendServiceFB } from '../backend-service.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
@Injectable({
  providedIn: 'root',
})
export class GameComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public readonly backend: BackendServiceFB
  ) {}


  /**
   * @description This method is called when the component is initialized.
   * It subscribes to the route parameters and retrieves the value of the 'lobby' param which is the ID of the firebase doc.
   * It then calls the `get` method.
   */
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.backend.gameID = params['lobby'];
      this.backend.get();
    });
  }


  /**
 * @description This method opens a dialog using the DialogAddPlayerComponent.
 * It subscribes to the `afterClosed` event of the dialog and pushes the input name to the players array in the backend.
 * It then calls the `updateGame` method.
 */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {});

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name)
        this.backend.game.players.push(
          this.sanitizeInput(name)
        );
      this.backend.updateGame();
    });
  }


  /**
 * @param {string} name - The input string that needs to be encoded.
 * @returns {string} The encoded string with characters like '&', '<', and '"' replaced with HTML entities.
 */
  sanitizeInput(name: string) {
    return name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/\s/g, "").trim()
  }


  /**
 * @param {number} ID - The index of the player in the players array.
 * @description This method opens a dialog using the DialogEditPlayerComponent.
 * It subscribes to the `afterClosed` event of the dialog and removes the player from the players array if the user confirms the delete action.
 * It then calls the `updateGame` method.
 */
  deletePlayer(ID: number) {
    const dialogRef = this.dialog.open(DialogEditPlayerComponent, {});
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change == 'DELETE') this.backend.game.players.splice(ID, 1);
      this.backend.updateGame();
    });
  }


  /**
 * @description This method takes a card from the stack of cards and adds it to the current card.
 * It updates the current player and adds the current card to the played cards after a timeout of 1500ms.
 */
  takeCard() {
    if (!this.backend.game.pickCardAnimation) {
      this.setCurrentCard();
      this.nextPlayer();
      this.updateCardStack();
    }
  }


  /**
   * pushes currentCard to playedCards array and toggles off the animation Using the 
   * updateGame() method transmitts the data to the backend.
   */
  updateCardStack() {
    setTimeout(() => {
      this.backend.game.playedCards.push(this.backend.game.currentCard);
      this.backend.game.pickCardAnimation = false;
      this.backend.updateGame();
    }, 1500);
  }


  /**
   * plays pickCardAnimation anim updates the currentPlayer using the Modulo Operator. Using the 
   * updateGame() method transmitts the data to the backend.
   */
  nextPlayer() {
      this.backend.game.pickCardAnimation = true;
      this.backend.game.currentPlayer++;
      this.backend.game.currentPlayer =
      this.backend.game.currentPlayer % this.backend.game.players.length;
      this.backend.updateGame();
  }


  /**
   * sets the currentCard by using the pop() method to retrieve the last card in the stack array
   */
  setCurrentCard() {
    this.backend.game.currentCard = this.backend.game.stack.pop()!;
    this.backend.updateGame();
  }
}