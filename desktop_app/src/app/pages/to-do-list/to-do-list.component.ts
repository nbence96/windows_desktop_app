import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, startWith, Subject, switchMap } from 'rxjs';
import { listItem } from 'src/app/models/listItem';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss']
})
export class ToDoListComponent implements OnInit {
  private readonly update$ = new Subject<void>();
  private db$!: Observable<IDBDatabase>;
  public toDoListItems$!: Observable<listItem[]>;
  form: FormGroup = new FormGroup({
    description: new FormControl(''),
    toDay: new FormControl(''),
    priority: new FormControl('')
  });
  public minDate!: Date;
  public panelOpenState: boolean;
  public displayedColumns: string[] = ['description', 'toDay', 'priority', 'done', 'delete'];


  constructor() {
    this.panelOpenState = false;
   }

  ngOnInit(): void {
    this.init();
    this.minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay());
    this.updatingToDoList();
  }

  private updatingToDoList(): void {
    this.toDoListItems$ = this.update$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.db$.pipe(
          switchMap(
            (db) =>
              new Observable<listItem[]>((observer) => {
                let transaction = db.transaction("toDoListItems");
                const request = transaction.objectStore("toDoListItems").getAll();
                transaction.oncomplete = () => {
                  transaction = null as any;
                  observer.next(request.result as listItem[]);
                  observer.complete();
                };
              })
          )
        )
      )
    );
  }

  public  deleteToDoListItem(toDoListId: any) {
    this.db$
      .pipe(
        switchMap(
          (db) =>
            new Observable((observer) => {
              let transaction = db.transaction("toDoListItems", "readwrite");
              transaction.objectStore("toDoListItems").delete(toDoListId);
              transaction.oncomplete = () => {
                transaction = null as any;
                this.update$.next();
                observer.complete();
              };
              return () => transaction?.abort();
            })
        )
      )
    .subscribe();
  }

  public  updateToDoListItem(toDo: listItem) {
    toDo.done = !toDo.done;
    this.db$
      .pipe(
        switchMap(
          (db) =>
            new Observable((observer) => {
              let transaction = db.transaction("toDoListItems", "readwrite");
              transaction.objectStore("toDoListItems").put(toDo);
              transaction.oncomplete = () => {
                transaction = null as any;
                this.update$.next();
                observer.complete();
              };
              return () => transaction?.abort();
            })
        )
      )
    .subscribe();
  }

  public async addToIndexedDB(item: listItem): Promise<void> {
    item.done = false;
    this.db$
      .pipe(
        switchMap(
          (db) =>
            new Observable((observer) => {
              let transaction = db.transaction("toDoListItems", "readwrite");
              transaction.objectStore("toDoListItems").add(item);
              transaction.oncomplete = () => {
                
                this.update$.next();
                observer.complete();
              };
              return () => transaction?.abort();
            })
        )
      )
      .subscribe();
  }
  

  private init(): void {
    this.db$ = new Observable<IDBDatabase>((observer) => {
      const openRequest = indexedDB.open("toDoListItemsDB");
      openRequest.onupgradeneeded = () => this.createDb(openRequest.result);
      openRequest.onsuccess = () => {
        observer.next(openRequest.result);
        observer.complete();
      };
    });
  }

  private createDb(db: IDBDatabase): void {
    db.createObjectStore("toDoListItems", { keyPath: "description" });
    console.log("create", db);
  }

}
