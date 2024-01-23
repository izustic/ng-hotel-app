import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css',
})
export class ReservationFormComponent implements OnInit {
  reservationForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
  
      this.reservationForm = this.formBuilder.group({
        checkInDate: ['', Validators.required],
        checkOutDate: ['', Validators.required],
        guestName: ['', Validators.required],
        guestEmail: ['', [Validators.required, Validators.email]],
        roomNumber: ['', Validators.required],
      });
      let id = this.activatedRoute.snapshot.paramMap.get('id')

      if(id){
           this.reservationService.getReservation(id).subscribe(reservation => {
             if(reservation)
               this.reservationForm.patchValue(reservation)
        })

      }
  }

  onSubmit() {
    console.log('Form submitted with values: ', this.reservationForm.value);
    if (this.reservationForm.valid) {
      let reservation: Reservation = this.reservationForm.value;
      
      let id = this.activatedRoute.snapshot.paramMap.get('id')
      
      if(id){   
        console.log('Form valid');
        this.reservationService.updateReservation(id, reservation).subscribe(()=>{
          console.log('Reservation updated');
        })
      } else {
        this.reservationService.addReservation(reservation).subscribe(()=>{
          console.log('Reservation added');
        })
      }

      this.router.navigate(['/list']);

    }
  }
}
