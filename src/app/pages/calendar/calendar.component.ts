import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  Events: any[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.onDateClick.bind(this)
  };
  onDateClick(res: any) {
    alert('Clicked on event : ' + res.event.title + " " + res.event.extendedProps.workdate);
  }
  ngOnInit() {
    setTimeout(() => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        events: this.Events,
        // dateClick: this.onDateClick.bind(this),
      };
    }, 2500);
  }
  dataLists: any = {};
  constructor(private http: HttpRequestService){
    this.loadData();
  }

  loadData() {
    let params = {
      // status: 1
    }
    this.http.post('order/staff-transport-requests', params).subscribe(
      (response: any) => {
        if(response && Array.isArray(response) && response.length>0){
          response.forEach((el: any)=>{
            el.start = el.workdate;
          })
          this.Events = response
        }
        
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

}