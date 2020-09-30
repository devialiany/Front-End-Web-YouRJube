import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: String;
  videos: any;
  ids: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.category = this.route.snapshot.paramMap.get('category');
    if(this.category == "music"){
      this.ids = 1;
    }else if (this.category == "sport"){
      this.ids = 2;
    }else if (this.category == "gaming"){
      this.ids = 3;
    }else if (this.category == "entertainment"){
      this.ids = 4;
    }else if (this.category == "news"){
      this.ids = 5;
    }else if (this.category == "travel"){
      this.ids = 6;
    }
    // else if (this.category == "Kids"){
    //   this.ids = 7;
    // }
  }

}
