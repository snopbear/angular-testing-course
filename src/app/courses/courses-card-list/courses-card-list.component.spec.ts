import {
  async,
  ComponentFixture,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { sortCoursesBySeqNo } from "../home/sort-course-by-seq";
import { Course } from "../model/course";
import { setupCourses } from "../common/setup-test-data";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;
  //fixture to create an instance of a component use fixture and it is test utility type it will help us to
  // some test operators like debugging the components

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents() //it will get back a promise resolved when ever the compilation process is finished
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
    // console.log(component);
  });

  it("should display the course list", () => {
         component.courses = setupCourses();

         fixture.detectChanges();

         const cards = el.queryAll(By.css(".course-card"));

         expect(cards).toBeTruthy("Could not find cards");
         expect(cards.length).toBe(12, "Unexpected number of courses");

  });

  it("should display the first course", () => {
    pending();
  });
});
