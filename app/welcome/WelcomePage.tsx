import React from 'react';
import DynamicFeature from './DynamicFeature'
import image1 from '../../public/image/banner1.jpeg';

export default function WelcomePage() {
  return (
    <div>
      <div>
      <DynamicFeature
        title="SwimPulsePro: Elevate Your Swim Coaching"
        description="Transform your swim coaching experience with SwimPulsePro, the innovative platform designed to empower coaches and swimmers to reach new heights."
        imageSrc={image1}
        imageSide="right"
        backgroundColor="#e7e7ee"
      />
      </div>
      
      <DynamicFeature
        title="Create Your Swim Groups"
        description="Organize your swimmers into focused training groups based on their skill levels, goals, and training schedules."
        imageSrc={image1}
        imageSide="left"
        subContent={
          <ul>
            <li>Invite Swimmers via Email or Social Media</li>
            <li>Manage Group Dynamics with Progress Updates</li>
          </ul>
        }
      />

      <DynamicFeature
        title="Measure and Collect Performance Data"
        description="Track swimmers' progress with custom metrics tailored to their performance goals."
        showTable={true}
        tableData={[
          { parameter: "Stroke Rate", description: "Number of strokes per minute", example: "50 strokes per minute" },
          { parameter: "Lap Time", description: "Time taken to complete a lap", example: "30 seconds" },
        ]}
        imageSrc={image1}
        imageSide="right"
      />

      <DynamicFeature
        title="Set Goals and Track Progress"
        description="Set specific, measurable goals and track key performance metrics."
        imageSrc={image1}
        imageSide="left"
      />

      <DynamicFeature
        title="Injury Logging and Rehabilitation"
        description="Monitor injuries and track rehabilitation progress for your swimmers."
        imageSrc={image1}
        imageSide="right"
      />
    </div>
  );
}
