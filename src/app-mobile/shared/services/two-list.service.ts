import { Observable } from 'rxjs';

export abstract class TwoListService {
  public abstract firstList(firstParam?: any, secondParam?: any, thirdParam?: any): Observable<any>;

  public abstract secondList(firstParam?: any, secondParam?: any, thirdParam?: any): Observable<any>;
}
