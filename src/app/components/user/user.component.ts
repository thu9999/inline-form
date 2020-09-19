import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IUser, UserDetail } from '../../core/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    @Input() user: IUser;
    @Output() handleSaveUser = new EventEmitter();
    userFormGroup: FormGroup;

    constructor( private fb: FormBuilder ) { }

    ngOnInit(): void {
        this.userFormGroup = this.fb.group( {
            id: new FormControl( this.user.id ),
            name: new FormControl( this.user.name ),
            details: this.fb.array( this.user.details.map( detail => this.createDetailGroup( detail ) ) )
        } )
    }

    get detailsFormArray(): FormArray {
        return this.userFormGroup.get( 'details' ) as FormArray;
    }

    private createDetailGroup( detail: UserDetail ): FormGroup {
        return this.fb.group( {
            age: new FormControl( detail.age ),
            job: new FormControl( detail.job )
        } )
    }

    addDetail(): void {
        const detail = new UserDetail();
        this.detailsFormArray.push( this.createDetailGroup( detail ) );
    }

    saveUser(): void {
        this.handleSaveUser.emit( this.userFormGroup.value );
    }
}
