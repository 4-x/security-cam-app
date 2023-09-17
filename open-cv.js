const cv = require('opencv4nodejs');

// Open a video stream (you can also use a file path)
const cap = new cv.VideoCapture(0);

// Create an initial frame for comparison
let prevFrame = null;

const detectChanges = () => {
  const frame = cap.read();

  // Check if the frame is empty (end of the stream)
  if (frame.empty) {
    console.log('Stream ended.');
    return;
  }

  // Convert the frame to grayscale for better change detection
  const grayFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);

  // Compare the current frame with the previous frame
  if (prevFrame !== null) {
    const diff = grayFrame.absDiff(prevFrame);

    // Threshold the difference to detect changes
    const threshold = diff.threshold(30, 255, cv.THRESH_BINARY);

    // Count the number of white pixels (changes)
    const changes = threshold.countNonZero();
    console.log(`Changes detected: ${changes}`);
  }

  // Update the previous frame
  prevFrame = grayFrame;

  // Recursively call detectChanges
  setImmediate(detectChanges);
};

// Start detecting changes
detectChanges();
