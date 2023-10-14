# Pure-Pursuit-Simulator

## 🎉 Overivew
This is a simple path planner and simulator for pure pursuit algorithms in the vex robotics competition. It lets you add points to create a path, and then you can see how a robot (that is up to scale with our robot) will move on the field, and any adjustments you need to make in the path.

## 🛠️ Setup
Prequesites for running the program:
  - NPM
  - Node JS
  - Text editor (I will be using VS Code)

1) Download the source code
2) Open it in a text editor such as VS Code
3) From the built in terminal in VS Code use the `cd` command and go to the Simulator folder.
4) Now run the command, `npm run dev`.
5) This should give you a localhost link from which you can view the project.

## 📝 Usage
In order to use the application you can place points on the image of the vex Over Under field, and when you add 2 more more you will see a path is created. If you click run simulation the robot will follow this path and that will give you can approximation of what the robot will do. You will also see boxes with each point and that can let you adjust the properties of each point, and at the very bottom you will see the output for the C++ code as a object.

## 🚀 Upcoming Features
Some features to look out for are:
  - A more accurate PID controller
  - An updated code output box
  - Options for changing the size of the robot
  - A timer to make sure your autonomous routine is within the time
  - The ability to create seperate paths so that you can add things like turns or other movements between them
