abstract class mobileBusiness<T> {
  list: T[] = [];
  public abstract add(item: T): void;
  public abstract delete(): void;
  public abstract view(): T[];
  public abstract modify(): void;
}


class BookKeeping extends mobileBusiness<IbookKeepingItem> {
  list: IbookKeepingItem[] = [];
  static $bookKeeping: BookKeeping;
  add(item: IbookKeepingItem): void {
    console.log("add")
  };
  delete(): void {

  };
  view(): IbookKeepingItem[] {
    return this.list
  };
  modify(): void {

  };
}
if (BookKeeping.$bookKeeping) {
  BookKeeping.$bookKeeping = new BookKeeping();
}
export default BookKeeping.$bookKeeping;