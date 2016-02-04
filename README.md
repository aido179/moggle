# Moggle
###### Boggle-like word game built with meteor.

http://moggle.meteor.com

Moggle is like boggle - You have 3 minutes to find as many words as possible using the 16 letters in the grid. You may start your word on any letter, but you can only use letters adjacent to each other. You may not repeat any letters. Words must be 3 letters or longer. 

In real boggle, the letters are on 16 dice. The dice positions are shuffled as well as the dice orientation wich leaves approximately [2^72](http://www.danvk.org/wp/2007-08-02/how-many-boggle-boards-are-there/) potential boggle boards. 

##Playing Moggle
Click and drag (or touch and drag) to select words. 

When the timer reaches 0:00, the game will and and your score will be displayed. 

Don't worry about accidentally selecting non-words or wrong letters. These will be ignored. 

## User accounts

If you create an account, moggle will store your previous games.

You can challenge other players to games. Click on 'my account', and type a username into the challenge box.

##Technology
Moggle is built using [meteor](http://www.meteor.com), with blaze. [Bootstrap](http://getbootstrap.com) is used for UI elements and layout. Simple.

##Roadmap
Here's what I want to get working (eventually). Pull requests are most welcome. 

- [x] Verify words against dictionary
- [x] User accounts / store games
- [x] Challenge other players (non-realtime) 
- [ ] Challenge other players (realtime, server time synced timer)
- [ ] ... suggestions welcome. Please make a new issue. 
