<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@ui.ac.id', // Use valid email domain
        'password' => 'Password123', // Use password that meets requirements
        'password_confirmation' => 'Password123',
        'student_id' => '2024001',
        'phone' => '+628123456789',
    ]);

    // Users are not auto-authenticated after registration due to pending verification
    $this->assertGuest();
    $response->assertRedirect(route('login'));
    $response->assertSessionHas('success');
    
    // Check user was created with pending status
    $this->assertDatabaseHas('users', [
        'email' => 'test@ui.ac.id',
        'status' => 'pending_verification',
    ]);
});
