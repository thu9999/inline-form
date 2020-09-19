import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatCell, MatCellDef, MatRow, MatRowDef, MatTable } from '@angular/material/table';
import { NgScrollbar } from 'ngx-scrollbar';
import { v4 as uuidv4 } from 'uuid';
import { IUser, UserDetail } from './core/user';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('detailExpand', [
          state('collapsed', style({height: '0px', minHeight: '0'})),
          state('expanded', style({height: '*'})),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
      ],
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild( NgScrollbar ) scrollRef: NgScrollbar;
    @ViewChild( 'userTable', { static: true } ) userTable: MatTable<any>;
    length = 20;
    users: IUser[];
    loading = false;
    columnsToDisplay = [ 'id', 'name', 'actions' ];
    expandedColumnsToDisplay = [ 'age', 'job' ];
    expandedElement: IUser = null;

    currentId: string = null;
    isEditting = false;

    constructor( private fb: FormBuilder ) {
    }

    ngOnInit(): void {
        this.users = Array.from( { length: this.length } ).map( ( _, i ) => {
            const id = uuidv4();
            return { 
                id, 
                name: `User ${ i + 1 }`,
                details: [
                    {
                        age: 30,
                        job: 'Engineer'
                    }
                ]
            }
        } );
    }

    ngAfterViewInit(): void {
        this.scrollRef.scrolled.subscribe( ( event: any ) => {
            const elem = event.target;
            if ( elem.scrollTop + elem.clientHeight >= elem.scrollHeight ) {
                this.createUsers();
            }
        } );
    }

    addUser(): void {
        const id = uuidv4();
        const user = { 
            id,
            name: '',
            details: []
        };
        this.expandedElement = user;
        this.users.unshift( user );
        this.scrollRef.scrollTo( {
            top: 0
        } );
        this.isEditting = true;
        this.currentId = id;
        this.userTable.renderRows();
    }

    createUsers(): void {
        this.loading = true;
        setTimeout( () => {
            const newUsers = Array.from( { length: 20 } ).map( ( _, i ) => {
                const id = uuidv4();
                return { 
                    id, 
                    name: `User ${ i + 1 + this.length }`, 
                    details: []
                }
            } );
            this.users = [ ...this.users, ...newUsers ];
            this.length += 20;
            this.loading = false;
        }, 3 * 1000 )
    }

    editUser( user: IUser ): void {
        this.isEditting = true;
        this.currentId = user.id;
    }

    saveUser( event: any ): void {
        const index = this.users.findIndex( user => user.id === event.id );
        if( index > -1 ) {
            this.users[ index ] = event;
            this.userTable.renderRows();
        }
        this.isEditting = false;
        this.currentId = null;
        console.log( this.users )
    }
}
