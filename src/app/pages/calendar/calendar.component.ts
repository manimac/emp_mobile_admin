import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
// import interactionPlugin from '@fullcalendar/angular';
declare var $: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  Events: any[] = [
    { title: 'Meeting', start: '2023-11-15', end: '2023-11-20', classNames: ['event-class1'] }
  ];
  selectedEvent: any = {};
  selectedEventTitle: any = null;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
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
    eventClick: this.onDateClick.bind(this),
    // dateClick: this.onDateClick.bind(this),
  };
  onDateClick(res: any) {
    console.log(res);
    this.selectedEvent = {};
    this.selectedEventTitle = null;
    if(res.event && res.event.extendedProps){
      this.selectedEvent = res.event.extendedProps;
      this.selectedEventTitle = res.event.title;
      $('#myModal').modal('show');
    }
    // alert('Clicked on event : ' + res.event.title + " " + res.event.extendedProps.workdate);
  }

  cancel(){
    this.selectedEvent = {};
  }
  ngOnInit() {
    setTimeout(() => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        events: this.Events,
      };
    }, 2500);
  }
  dataLists: any = {};
  constructor(private http: HttpRequestService) {
    this.loadData();
  }

  loadData() {
    let params = {
      // status: 1
    }
    this.http.post('order/staff-transport-requests', params).subscribe(
      (response: any) => {
        if (response && Array.isArray(response) && response.length > 0) {
          response.forEach((el: any) => {
            el.start = el.workstartdate.split('-').reverse().join('-');
            el.end = el.workenddate.split('-').reverse().join('-');
          })
          this.Events = response
          console.log(this.Events)
        }

      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  getEventStatus(data: any){
    let status = '';
    if(data.status == 0){
      status = 'Rejected';
    }
    else if(data.status == 1){
      status = 'Pending';
    }
    else if(data.status == 2){
      status = 'Inprogress';
    }
    else if(data.status == 3){
      status = 'Completed';
    }
    return status;
  }

}