# Firebase Usage Guide for Developers

## Quick Reference for Using Firebase Services

### Authentication

```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, loading, login, logout, register, updateUser } = useAuth();
  
  // Check if user is logged in
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  // User is logged in
  return <div>Welcome {user.name}</div>;
}
```

### Creating Documents

```typescript
import { createDocument } from '../services/databaseService';

// Create a new event
const eventData = {
  title: 'Workshop',
  description: 'A great workshop',
  date: '2026-04-01',
  venue: 'Lab A',
  price: 100,
  isPaid: true,
  maxParticipants: 50,
  registrationDeadline: '2026-03-25',
};

const eventId = await createDocument('events', eventData);
```

### Reading Documents

```typescript
import { getDocument, getCollection } from '../services/databaseService';

// Get a single document
const event = await getDocument('events', eventId);

// Get all documents
const allEvents = await getCollection('events');

// Get filtered documents
import { where } from 'firebase/firestore';
const upcomingEvents = await getCollection('events', [
  where('status', '==', 'upcoming')
]);
```

### Updating Documents

```typescript
import { updateDocument } from '../services/databaseService';

await updateDocument('events', eventId, {
  title: 'Updated Title',
  maxParticipants: 60,
});
```

### Deleting Documents

```typescript
import { deleteDocument } from '../services/databaseService';

await deleteDocument('events', eventId);
```

### Uploading Files

```typescript
import { uploadFile, uploadProfilePhoto } from '../services/storageService';

// Upload with progress tracking
const url = await uploadProfilePhoto(
  file,
  userId,
  (progress) => {
    console.log(`Upload progress: ${progress.progress}%`);
  }
);

// Simple upload
const url = await uploadFile(file, 'path/to/file.jpg');
```

### Exporting Data

```typescript
import { exportData } from '../services/exportService';

// Export users to Excel
const users = await getCollection('users');
exportData(users, 'Users_Export', 'excel', 'users');

// Export to CSV
exportData(users, 'Users_Export', 'csv', 'users');
```

## Common Patterns

### Event Registration Flow

```typescript
import { useAuth } from '../context/AuthContext';
import { createEventRegistration } from '../services/databaseService';

function RegisterForEvent({ eventId }) {
  const { user } = useAuth();
  
  const handleRegister = async () => {
    if (!user) {
      alert('Please log in first');
      return;
    }
    
    const registration = {
      userId: user.id,
      eventId: eventId,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      status: 'pending',
      paymentStatus: 'pending',
    };
    
    await createEventRegistration(registration);
    toast.success('Registration submitted!');
  };
  
  return <button onClick={handleRegister}>Register</button>;
}
```

### Blog Creation Flow

```typescript
import { createBlog } from '../services/databaseService';
import { uploadBlogImage } from '../services/storageService';

async function createNewBlog(blogData, imageFile) {
  // 1. Create blog document first to get ID
  const blogId = await createBlog({
    title: blogData.title,
    authorId: user.id,
    authorName: user.name,
    content: blogData.content,
    category: blogData.category,
    status: 'pending',
  });
  
  // 2. Upload image if provided
  if (imageFile) {
    const imageUrl = await uploadBlogImage(imageFile, blogId);
    
    // 3. Update blog with image URL
    await updateBlog(blogId, { imageUrl });
  }
  
  return blogId;
}
```

### Admin Check

```typescript
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router';

function AdminOnlyPage() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return <div>Admin Dashboard</div>;
}
```

### Real-time Data Listening

```typescript
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useEffect, useState } from 'react';

function MyEvents() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  
  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, 'registrations'),
      where('userId', '==', user.id)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegistrations(data);
    });
    
    return () => unsubscribe();
  }, [user]);
  
  return (
    <div>
      {registrations.map(reg => (
        <div key={reg.id}>{reg.eventTitle}</div>
      ))}
    </div>
  );
}
```

## Error Handling

```typescript
try {
  await createDocument('events', eventData);
  toast.success('Event created!');
} catch (error) {
  console.error('Error creating event:', error);
  toast.error(error.message || 'Failed to create event');
}
```

## Best Practices

1. **Always check authentication before operations**
   ```typescript
   if (!user) {
     toast.error('Please log in first');
     return;
   }
   ```

2. **Handle loading states**
   ```typescript
   const [loading, setLoading] = useState(false);
   
   const handleSubmit = async () => {
     setLoading(true);
     try {
       await createDocument('events', data);
     } finally {
       setLoading(false);
     }
   };
   ```

3. **Use try-catch for all Firebase operations**
   ```typescript
   try {
     await someFirebaseOperation();
   } catch (error) {
     console.error(error);
     toast.error('Operation failed');
   }
   ```

4. **Clean up listeners**
   ```typescript
   useEffect(() => {
     const unsubscribe = onSnapshot(query, callback);
     return () => unsubscribe();
   }, []);
   ```

5. **Validate data before sending to Firebase**
   ```typescript
   if (!data.title || !data.date) {
     toast.error('Please fill all required fields');
     return;
   }
   ```

## Migration from Mock Data

The application is set up to work with Firebase, but some components still use mock data. To migrate:

1. Replace localStorage operations with Firebase operations
2. Update state management to use Firebase real-time listeners
3. Remove mock data imports where applicable
4. Test thoroughly before deploying

## Resources

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- Main setup guide: `/FIREBASE_SETUP.md`
