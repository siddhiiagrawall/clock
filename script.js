// Function to draw the clock on a canvas
function drawClock(context, radius, time) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  // Move the origin to the center of the canvas
  context.translate(radius, radius);

  // Draw the clock face
  context.beginPath();
  context.arc(0, 0, radius, 0, 2 * Math.PI);
  context.fillStyle = '#212121';
  context.fill();
  context.strokeStyle = '#fff';
  context.lineWidth = 8;
  context.stroke();

  // Draw the numbers
  context.font = `${radius * 0.15}px Arial`;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  for (let num = 1; num <= 12; num++) {
      const ang = num * Math.PI / 6;
      context.rotate(ang);
      context.translate(0, -radius * 0.85);
      context.rotate(-ang);
      context.fillText(num.toString(), 0, 0);
      context.rotate(ang);
      context.translate(0, radius * 0.85);
      context.rotate(-ang);
  }

  // Draw the hands
  drawHand(context, (time.hours % 12) * Math.PI / 6 + (time.minutes * Math.PI / 360) + (time.seconds * Math.PI / 21600), radius * 0.5, radius * 0.07);
  drawHand(context, (time.minutes * Math.PI / 30) + (time.seconds * Math.PI / 1800), radius * 0.8, radius * 0.07);
  drawHand(context, time.seconds * Math.PI / 30, radius * 0.9, radius * 0.02);

  // Reset the transformation matrix
  context.setTransform(1, 0, 0, 1, 0, 0);
}

// Function to draw each hand on the clock
function drawHand(context, pos, length, width) {
  context.beginPath();
  context.lineWidth = width;
  context.lineCap = 'round';
  context.moveTo(0, 0);
  context.rotate(pos);
  context.lineTo(0, -length);
  context.stroke();
  context.rotate(-pos);
}

// Utility function to get the time in a specific timezone
function getTimeInZone(offset) {
  let now = new Date();
  let utc = now.getTime() + now.getTimezoneOffset() * 60000;
  let localTime = new Date(utc + 3600000 * offset);
  return {
      hours: localTime.getHours(),
      minutes: localTime.getMinutes(),
      seconds: localTime.getSeconds()
  };
}

// Function to update the clocks
function updateClocks() {
  const clocks = [
      { canvas: document.getElementById('clock1'), offset: 5.5 }, // New Delhi (IST)
      { canvas: document.getElementById('clock2'), offset: -5 },  // New York (EST)
      { canvas: document.getElementById('clock3'), offset: 0 },   // London (GMT)
      { canvas: document.getElementById('clock4'), offset: 9 },   // Tokyo (JST)
      { canvas: document.getElementById('clock5'), offset: 10 }   // Sydney (AEST)
  ];

  clocks.forEach(clock => {
      const context = clock.canvas.getContext('2d');
      const radius = clock.canvas.width / 2;
      const time = getTimeInZone(clock.offset);
      drawClock(context, radius, time);
  });

  // Update the clocks every second
  setTimeout(updateClocks, 1000);
}

// Start the clock updating process
updateClocks();
