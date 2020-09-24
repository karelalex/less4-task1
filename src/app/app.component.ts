import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTabGroup} from '@angular/material/tabs';

export interface Lesson {
  id: string;
  date?: Date;
  theme?: string;
  homework?: string;
  notes?: string;
}

export interface Student {
  id: string;
  name?: string;
  surname?: string;
  patronymic?: string;
  marks?: Record<string, number>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild('Tabs') tabs: MatTabGroup;
  tabIndex: number;
  editingLessonId: string;
  editingStudentId: string;
  students: Student[] = [];
  lessons: Lesson[]  = [];

  ngOnInit(): void {
   this.loadLessons();
   this.loadStudents();
  }

  private loadStudents(): void {
    this.students = JSON.parse(localStorage.getItem('studentList')) || [];
  }

  onFinishLessonEditing(): void {
    this.editingLessonId = null;
    this.tabIndex = 0;
    this.loadLessons();
  }

  loadLessons(): void {
    const recoveredLessons = JSON.parse(localStorage.getItem('lessonList')) || [];
    this.lessons = recoveredLessons.map((item) => {
      return {...item, date: new Date(item.date)};
    });
  }

  onStartEditLesson(id: string): void {
    this.editingLessonId = id;
    this.tabIndex = 2;
  }

  onStartEditingStudent(id: string): void {
    this.editingStudentId = id;
    this.tabIndex = 3;
  }

  onStudentListChanged(studentList: Student[]): void {
    this.students = studentList;
  }

  onFinishStudentEditing(): void {
    this.editingStudentId = null;
    this.loadStudents();
    this.tabIndex = 1;
  }
}
