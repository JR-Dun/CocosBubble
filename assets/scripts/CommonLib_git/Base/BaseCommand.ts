

export abstract class BaseCommand  {

  public game;
  public gameAck;

  public errorCode:number;

  public abstract setRecevicerData(gameAck);

  public timePassed():number {
      if(this.game) {
        let startDate = Number(this.game.id);
        return Date.now() - startDate;
      }

      return 0;
  }
 
  


}
