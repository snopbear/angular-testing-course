import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "./courses.service";
import { COURSES } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {
  let coursesServices: CoursesService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });
    coursesServices = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should retrieve all courses", () => {
    coursesServices.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returned"); // truthy service not retuning an error or null
      expect(courses.length).toBe(12, "Incorrect number of courses"); // truthy service not retuning an error or null
      const course = courses.find((courses) => courses.id == 12);
      expect(course.titles.description).toBe("Angular Testing Course");
    });
    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toBe("GET");

    /*Flush
This unit test shows that all async tasks should be finished when it returns, 
and that the returned value tells you how long it took for them to finish. */
    req.flush({ payload: Object.values(COURSES) });
  });

  it("should find a course by id", () => {
    coursesServices.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });
    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toBe("GET");
    req.flush(COURSES[12]);
  });

  it("should save the course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    coursesServices.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });
    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toBe("PUT");
    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );
    req.flush({
      ...COURSES[12],
    });
  });

  it("should give an error if save course fails", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    coursesServices.saveCourse(12, changes).subscribe(
      () => fail("the save course operation should have failed"),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toBe("PUT");
    req.flush("Save course failed", {
      status: 500,
      statusText: "Save Course Failed",
    });
  });



  afterEach(() => {
    /*
    no other http request will invoke accidentally 


    httpTestingController. verify(); is useful for cases when you want
     *  to verify that specific HTTP requests were not sent. i.e. when there
     *  is conditional logic around an HTTP request.Sep 20, 2022 */
    httpTestingController.verify();
  });
});
