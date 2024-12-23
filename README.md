Interactive Puzzle Creator and Player
Goal: Create an interactive web application that allows users to create and play custom image
puzzles, with AI-enhanced features.
Features:
Puzzle Creation (/puzzle/create):

- Upload an image to create a puzzle from
- Enable users to "break" the image into puzzle pieces by drawing paths
- Generate AI-powered descriptions and titles based on the uploaded image
- Save the created puzzle with a unique identifier
  Puzzle Playing (/puzzle/play/[id]):
- Load and display puzzle pieces based on saved configurations
- Allow players to drag and arrange pieces to complete the puzzle
- Show the AI-generated context about the puzzle
- Provide feedback on progress and completion
  Core Requirements:
- Build using Next.js 14 with App Router
- Implement drag-and-drop functionality for puzzle pieces
- Create an intuitive interface for drawing puzzle piece shapes
- Integrate with OpenAI API for image analysis
- Store puzzle configurations (method of storage is up to you)
  Guidelines:
- Focus on creating an engaging and intuitive user experience
- Consider accessibility in your design decisions
- You may use any UI library or components of your choice
- Think about load states, error handling, and edge cases
- Consider adding features that would make the experience more engaging
- Pay attention to animations and transitions
- Create reusable components and hooks
- Mind code quality, structure, and performance
- Keep it as simple as possible while maintaining good UX
  Bonus Points For:
- Innovative use of AI features
- Creative approaches to puzzle creation or gameplay
- Thoughtful error states and loading experiences
- Mobile-responsive design
- Accessibility considerations
- Performance optimizations
