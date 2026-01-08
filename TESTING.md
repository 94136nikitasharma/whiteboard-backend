# Testing Guide

Comprehensive testing guide for the Whiteboard Backend and Frontend application.

## Table of Contents

- [Quick Start Testing](#quick-start-testing)
- [REST API Testing](#rest-api-testing)
- [WebSocket Testing](#websocket-testing)
- [Frontend Testing](#frontend-testing)
- [Multi-User Testing](#multi-user-testing)
- [Performance Testing](#performance-testing)
- [Automated Testing](#automated-testing)

---

## Quick Start Testing

### 1. Start the Server

```bash
npm run dev
```

Server should start on `http://localhost:8080`

### 2. Verify Server is Running

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Whiteboard backend is running"
}
```

---

## REST API Testing

### Test 1: Root Endpoint

```bash
curl http://localhost:8080/
```

**Expected:** API information with version and endpoints

### Test 2: Create Whiteboard

```bash
curl -X POST http://localhost:8080/api/whiteboards \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Board 1"}'
```

**Expected:** 
- Status: 201 Created
- Response contains whiteboard ID, name, timestamps

### Test 3: Get All Whiteboards

```bash
curl http://localhost:8080/api/whiteboards
```

**Expected:**
- Status: 200 OK
- Array of whiteboards
- Count field

### Test 4: Get Specific Whiteboard

Replace `{id}` with actual whiteboard ID:

```bash
curl http://localhost:8080/api/whiteboards/{id}
```

**Expected:**
- Status: 200 OK
- Whiteboard details with drawing objects

### Test 5: Get Whiteboard State

```bash
curl http://localhost:8080/api/whiteboards/{id}/state
```

**Expected:**
- Current canvas state
- Drawing objects array
- Users list

### Test 6: Delete Whiteboard

```bash
curl -X DELETE http://localhost:8080/api/whiteboards/{id}
```

**Expected:**
- Status: 200 OK
- Success message

### Test 7: Error Handling

```bash
# Invalid whiteboard ID
curl http://localhost:8080/api/whiteboards/invalid-id

# Missing required field
curl -X POST http://localhost:8080/api/whiteboards \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:** Proper error responses with status codes

---

## WebSocket Testing

### Using Test Client

1. **Open test client:**
   ```bash
   open test-client.html
   ```

2. **Connect to server:**
   - Enter server URL: `http://localhost:8080`
   - Click "Connect"
   - Verify connection status turns green

3. **Join a room:**
   - Enter room ID (e.g., `test-room-123`)
   - Enter your name
   - Click "Join Room"
   - Verify canvas state is received

4. **Send test drawing:**
   - Select tool type (pen, line, etc.)
   - Choose color
   - Set stroke width
   - Click "Send Test Drawing"
   - Verify drawing event in log

5. **Clear canvas:**
   - Click "Clear Canvas"
   - Verify canvas_cleared event

### Using Browser Console

```javascript
// Connect
const socket = io('http://localhost:8080');

// Join room
socket.emit('join_room', {
  roomId: 'test-room',
  userName: 'Tester'
});

// Listen for events
socket.on('canvas_state', (data) => {
  console.log('Canvas state:', data);
});

socket.on('drawing', (data) => {
  console.log('New drawing:', data);
});

// Send drawing
socket.emit('draw', {
  roomId: 'test-room',
  drawingData: {
    type: 'pen',
    color: '#FF0000',
    width: 3,
    points: [{x: 100, y: 100}, {x: 200, y: 200}]
  }
});

// Clear canvas
socket.emit('clear_canvas', { roomId: 'test-room' });
```

---

## Frontend Testing

### Test the Full Application

1. **Open the frontend:**
   ```
   http://localhost:8080/index.html
   ```
   or
   ```
   http://localhost:8080
   ```

2. **Join Room:**
   - Enter your name
   - Enter room ID or leave blank for random
   - Click "Join Room"
   - ✅ Verify connection status shows "Connected"

3. **Drawing Tools:**
   - **Pen Tool:**
     - Select pen tool
     - Draw on canvas
     - ✅ Verify strokes appear
   
   - **Color Picker:**
     - Change color
     - Draw again
     - ✅ Verify new color is used
   
   - **Stroke Width:**
     - Adjust slider
     - Draw lines
     - ✅ Verify thickness changes

4. **Clear Canvas:**
   - Click "Clear Canvas" button
   - ✅ Verify canvas clears

5. **Responsive Design:**
   - Resize browser window
   - ✅ Verify canvas scales appropriately

---

## Multi-User Testing

### Setup

1. **Open two browser windows/tabs:**
   - Window 1: `http://localhost:8080`
   - Window 2: `http://localhost:8080`

2. **Join the same room:**
   - Both windows: Enter same room ID (e.g., `collaboration-test`)
   - Different names (e.g., "User 1" and "User 2")

### Test Cases

#### Test 1: User Presence

- ✅ Both users appear in "Active Users" panel
- ✅ User count shows "2"

#### Test 2: Real-time Drawing

- **User 1:** Draw on canvas
- ✅ **User 2:** Should see the drawing appear in real-time
- **User 2:** Draw something different
- ✅ **User 1:** Should see User 2's drawing

#### Test 3: Color Synchronization

- **User 1:** Change color to red and draw
- ✅ **User 2:** Should see red drawing
- **User 2:** Change color to blue and draw
- ✅ **User 1:** Should see blue drawing

#### Test 4: Clear Canvas

- **User 1:** Click "Clear Canvas"
- ✅ **Both users:** Canvas should clear

#### Test 5: User Disconnection

- **User 1:** Close browser tab
- ✅ **User 2:** Should see user count decrease to "1"
- ✅ **User 2:** Should see User 1 removed from active users

#### Test 6: Rejoin Room

- **User 1:** Rejoin the same room
- ✅ Should receive current canvas state
- ✅ Should see existing drawings from User 2

---

## Performance Testing

### Test 1: Multiple Drawings

```javascript
// Send 100 drawings rapidly
for (let i = 0; i < 100; i++) {
  socket.emit('draw', {
    roomId: 'test-room',
    drawingData: {
      type: 'pen',
      color: '#000000',
      width: 2,
      points: [
        {x: i * 5, y: i * 5},
        {x: i * 5 + 10, y: i * 5 + 10}
      ]
    }
  });
}
```

**Expected:**
- ✅ All drawings sent without errors
- ✅ Server handles requests smoothly
- ✅ Other clients receive all drawings

### Test 2: Large Canvas State

1. Create many drawings on canvas
2. New user joins room
3. **Expected:** Receives full canvas state quickly

### Test 3: Memory Usage

```bash
# Monitor server memory
pm2 monit

# Or with Node.js
node --inspect src/server.js
```

**Expected:** Stable memory usage under load

---

## Automated Testing

### Unit Tests (Example - to implement)

Create `test/storage.test.js`:

```javascript
const StorageService = require('../src/services/StorageService');

describe('StorageService', () => {
  test('should create whiteboard', () => {
    const wb = StorageService.createWhiteboard('Test');
    expect(wb.name).toBe('Test');
    expect(wb.id).toBeDefined();
  });
  
  test('should get whiteboard', () => {
    const wb = StorageService.createWhiteboard('Test');
    const found = StorageService.getWhiteboard(wb.id);
    expect(found).toBeDefined();
    expect(found.id).toBe(wb.id);
  });
});
```

### Integration Tests

Create `test/api.test.js`:

```javascript
const request = require('supertest');
const app = require('../src/app');

describe('API Endpoints', () => {
  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });
  
  test('POST /api/whiteboards', async () => {
    const res = await request(app)
      .post('/api/whiteboards')
      .send({ name: 'Test Board' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

### Run Tests

```bash
npm test
```

---

## Test Checklist

### Backend API
- [ ] Health check endpoint
- [ ] Create whiteboard
- [ ] Get all whiteboards
- [ ] Get specific whiteboard
- [ ] Delete whiteboard
- [ ] Get whiteboard state
- [ ] Error handling

### WebSocket Events
- [ ] Connect/disconnect
- [ ] Join room
- [ ] Leave room
- [ ] Send drawing
- [ ] Receive drawing
- [ ] Clear canvas
- [ ] Canvas state sync
- [ ] User joined event
- [ ] User left event
- [ ] Users update

### Frontend
- [ ] Load application
- [ ] Join room modal
- [ ] Connect to server
- [ ] Drawing with pen
- [ ] Color picker
- [ ] Stroke width
- [ ] Tool selection
- [ ] Clear canvas button
- [ ] User list display
- [ ] Real-time updates

### Multi-User
- [ ] Two users see each other
- [ ] Drawings sync in real-time
- [ ] Canvas clear syncs
- [ ] User join notifications
- [ ] User leave notifications
- [ ] New user receives canvas state

### Performance
- [ ] Handle 100+ drawings
- [ ] Multiple concurrent users
- [ ] Stable memory usage
- [ ] No memory leaks
- [ ] Fast canvas state sync

---

## Known Issues & Limitations

1. **In-Memory Storage:**
   - Data lost on server restart
   - Not suitable for production at scale

2. **No Authentication:**
   - Anyone can join any room
   - No user verification

3. **Limited Drawing Tools:**
   - Only pen tool fully implemented
   - Shapes need additional work

4. **No Undo/Redo:**
   - Not implemented yet

---

## Troubleshooting

### WebSocket not connecting

1. Check server is running: `curl http://localhost:8080/health`
2. Check browser console for errors
3. Verify firewall allows WebSocket connections
4. Check CORS settings

### Drawings not syncing

1. Verify both users in same room
2. Check browser console for socket events
3. Verify server logs show drawing events
4. Test with test-client.html

### High latency

1. Check network connection
2. Monitor server CPU/memory
3. Reduce number of drawing points
4. Consider implementing throttling

---

## Test Results Template

```
# Test Results - [Date]

## Environment
- Node.js version: 
- Browser: 
- OS: 

## Test Results

### REST API
- [ ] All endpoints working
- [ ] Error handling correct
- [ ] Response times acceptable

### WebSocket
- [ ] Connections stable
- [ ] Events syncing
- [ ] No dropped messages

### Frontend
- [ ] UI responsive
- [ ] Drawing smooth
- [ ] No console errors

### Multi-User
- [ ] Tested with X users
- [ ] All features working
- [ ] No conflicts

## Issues Found
1. 
2. 

## Notes
-
```

---

## Next Steps

After testing:

1. **Fix any issues found**
2. **Implement missing features**
3. **Add database persistence**
4. **Implement authentication**
5. **Add automated tests**
6. **Deploy to production**
