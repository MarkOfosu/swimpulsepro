'use client';
import React from 'react';
import SectionHeader from '@components/nav/SectionHeader';
import { useRouter } from 'next/navigation';

{/*  walkthrough process for registration and sign in
  Register your swim team and so coaches can manage their swimmer groups
  and track their progress. 
  1. Register your team - You have to be a coach or an admin to register a team
  -form fields: 
  - Team Name
  -Team location
  - name of admin
  - email address of admin
  - phone number of admin
  - password
  - confirm password
  - are you a swim coach as well? (yes/no)
  *note: if you are a swim coach, you will be also be registered as a coach for the team. so you will not need to register as a coach again.
  * note that only swim coaches can create swim groups and add swimmers to the swim groups. 

  - add important links to be interegrated with the app. e.g team records, team website, team social media pages etc. 

    **user name will always be the email address**
  use google sign in to sign up. 
  or use your email address to up - onece done, a confrimation email will be sent to your email address. you will have to confirm your email address before you can sign in. 



  ** After submitting the team registration form, you will have to wait for approval from the SwimPulsePro team. **
  **Once approved, you can sign in and start sending invites to your coaches.**
  -sign up fields: 
  - First Name
  - Last Name
  - Email
  - Password
  - Confirm Password
  - Phone Number
  - Date of Birth




  -Coaches use the invite link to sign up and join your team. they will be redirected to the coach dashboard where they can manage their swim groups and swimmers. 
  - Coaches can add swim groups and swimmers to your the swim groups by generating a QR code for swimmers to join. This will be a unique code that the swimmer can scan to join the particular swim group. 
  -This invite link would lead to a sign-up form page with the following fields: 
  -fixed fields: Team Name, Swim Group Name,Swim Group Coach then the following fields:
  - First Name
  - Last Name
  - Email
  - Password
  - Confirm Password
  - Phone Number
  - Date of Birth


  */}


  const HomePage: React.FC = () => {
    const router = useRouter();
  
    const handleSignIn = () => {
      router.push('/signin');  
    };
  
    const handleRegisterTeam = () => {
      router.push('/register');
    };
  
    return (
      <div>
        <SectionHeader heading="Welcome to SwimPulsePro" />
        <p>Where every stroke counts!</p>
        <button onClick={handleSignIn}>Sign In</button>
        <button onClick={handleRegisterTeam}>Register a Team</button>
      </div>
    );
  }
  

export default HomePage;
