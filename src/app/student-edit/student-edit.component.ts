import {Component, Input, OnChanges, Output, SimpleChanges, EventEmitter} from '@angular/core';
import {v4 as uuidV4} from 'uuid';
import {Student} from '../app.component';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnChanges {
  @Input() studentId: string;
  @Input() students: Student[];
  @Output() finishEdit = new EventEmitter();
  editingStudent = {} as Student;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('чанджес', changes);
    if (!changes.studentId) {return; }
    const currentStudentId = changes.studentId.currentValue;
    if (changes.studentId.previousValue !== currentStudentId) {
      this.initForm(currentStudentId);
    }
  }

  initForm = (id: string): void => {
    if (id) {
      const studentToEdit = this.students.find((item) => item.id === id);
      if (studentToEdit) {
        this.editingStudent = {...studentToEdit};
        return;
      }
    }
    this.editingStudent = {id: uuidV4()};
  }

  afterEdit = () => {
    const newStudentsList = [...this.students];
    const index = newStudentsList.findIndex((item) => this.editingStudent.id === item.id);
    if (index < 0) {
      newStudentsList.push({...this.editingStudent, marks: {}});
    } else {
      newStudentsList[index] = {...this.editingStudent};
    }
    this.saveStudentList(newStudentsList);
    this.initForm(null);
    this.finishEdit.emit();
  }

  saveStudentList = (students: Student[]) => localStorage.setItem('studentList', JSON.stringify(students.sort((a, b) =>
    (this.formatName(a).localeCompare(this.formatName(b))))))

  formatName = (student: Student): string => [student.surname, student.name, student.patronymic].filter(Boolean).join(' ');

  cancelEdit = () => {
    this.initForm(null);
    this.finishEdit.emit();
  }

  deleteStudent = (id) => {
    const newStudentsList = this.students.filter((item) => item.id !== id);
    this.saveStudentList(newStudentsList);
    this.initForm(null);
    this.finishEdit.emit();
  }

}
