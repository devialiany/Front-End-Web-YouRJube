import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../service/session.service';
import { DatabaseService } from '../../service/database.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})

export class MembershipComponent implements OnInit {
  memberships = []
  status = "Basic"
  constructor(public ss: SessionService, public db: DatabaseService, private apollo: Apollo) { }

  ngOnInit(): void {
    if(this.ss.isLogged == true){
      this.apollo.watchQuery<any>({
        query: gql `query{
          getMembershipByCreatorId(creator_id:${this.ss.creator_id}){
            type
            date
            expired_date
            status
          }
        }`
      }).valueChanges.subscribe(result =>{
        this.memberships = result.data.getMembershipByCreatorId
        for(let i of this.memberships){
          if(i.status == "active"){
            this.db.membership = true
            this.status = "Premium"
          }
        }
      });
    }
  }

  validateUser(type: number){
    if(this.ss.isLogged == false){
      this.db.modalWantLog = true
    }else if(this.ss.isLogged == true && this.db.membership == true){
      alert("You already premium account")
    }else if(this.ss.isLogged == true && this.db.membership == false){
      this.registerMember(type)
    }
  }

  registerMember(type:number){
    let today = new Date().toLocaleDateString()
    let expired: string;
    if(type == 1){
      expired = new Date(new Date(Date.now() + (1000*60*60*24*30))).toLocaleDateString()
    }else{
      expired = new Date(new Date(Date.now() + (1000*60*60*24*365))).toLocaleDateString()
    }
    //insert data
    this.apollo.mutate({
      mutation: gql `mutation($creator_id: Int!, $type: Int!, $date: String!, $expired_date: String!, $status: String!){
          insertMembership(input: {creator_id: $creator_id, type: $type, date: $date, expired_date: $expired_date, status: $status}){
            id
          }
      }`,
      variables:{
        creator_id: this.ss.creator_id,
        type: type,
        date: today,
        expired_date: expired,
        status: "active",
      },
    }).subscribe()
    this.apollo.mutate({
      mutation: gql `mutation($creator_id: Int!, $membership_status: Int!){
        updateMembershipCreator(creator_id: $creator_id, input: {membership_status: $membership_status }){
          membership_status
        }
      }`,
      variables:{
        creator_id: this.ss.creator_id,
        membership_status: 2
      },
      refetchQueries: [{
        query: gql `query{
          getMembershipByCreatorId(creator_id:${this.ss.creator_id}){
            type
            date
            expired_date
            status
          }
        }`,
        variables: { repoFullName: 'apollographql/apollo-client' },
      }]
    }).subscribe()
    this.ss.creator_membership = 2
    this.status = "Premium"
    alert("Success Resgister Membership")
  }
}
