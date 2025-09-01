<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\Laboratory;
use App\Models\LoanRequest;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ChemLabSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create laboratories
        $labs = [
            [
                'name' => 'Physical Chemistry Laboratory',
                'code' => 'PCL001',
                'description' => 'Laboratory for physical chemistry experiments and analysis',
                'location' => 'Chemistry Building, Floor 2',
                'status' => 'active',
            ],
            [
                'name' => 'Organic Chemistry Laboratory',
                'code' => 'OCL002',
                'description' => 'Specialized laboratory for organic synthesis and analysis',
                'location' => 'Chemistry Building, Floor 3',
                'status' => 'active',
            ],
            [
                'name' => 'Analytical Chemistry Laboratory',
                'code' => 'ACL003',
                'description' => 'Advanced analytical instrumentation laboratory',
                'location' => 'Chemistry Building, Floor 4',
                'status' => 'active',
            ],
            [
                'name' => 'Process Engineering Laboratory',
                'code' => 'PEL004',
                'description' => 'Laboratory for chemical process engineering studies',
                'location' => 'Engineering Building, Floor 1',
                'status' => 'active',
            ],
        ];

        $laboratories = collect($labs)->map(function ($lab) {
            return Laboratory::create($lab);
        });

        // Create admin user with proper email domain
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@che.ui.ac.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
            'student_id' => 'ADM001',
            'phone' => '+62812345678901',
            'email_verified_at' => now(),
        ]);

        // Create kepala lab users
        $kepalaLabs = [];
        foreach ($laboratories as $index => $lab) {
            $kepalaLab = User::create([
                'name' => "Head of " . explode(' ', $lab->name)[0] . " Lab",
                'email' => "kepala.lab" . ($index + 1) . "@che.ui.ac.id",
                'password' => Hash::make('password'),
                'role' => 'kepala_lab',
                'status' => 'active',
                'laboratory_id' => $lab->id,
                'student_id' => 'KL' . str_pad((string)($index + 1), 3, '0', STR_PAD_LEFT),
                'phone' => '+6281234567800' . ($index + 1),
                'email_verified_at' => now(),
            ]);
            $kepalaLabs[] = $kepalaLab;
        }

        // Create lab assistants
        $labAssistants = [];
        foreach ($laboratories as $index => $lab) {
            $assistant = User::create([
                'name' => "Lab Assistant " . ($index + 1),
                'email' => "laboran" . ($index + 1) . "@che.ui.ac.id",
                'password' => Hash::make('password'),
                'role' => 'lab_assistant',
                'status' => 'active',
                'laboratory_id' => $lab->id,
                'student_id' => 'LA' . str_pad((string)($index + 1), 3, '0', STR_PAD_LEFT),
                'phone' => '+6281234567890' . ($index + 1),
                'email_verified_at' => now(),
            ]);
            $labAssistants[] = $assistant;
        }

        // Create dosen users
        $dosens = [];
        for ($i = 1; $i <= 3; $i++) {
            $dosen = User::create([
                'name' => "Dr. Lecturer " . $i,
                'email' => "dosen" . $i . "@che.ui.ac.id",
                'password' => Hash::make('password'),
                'role' => 'dosen',
                'status' => 'active',
                'laboratory_id' => fake()->randomElement($laboratories)->id,
                'student_id' => 'DSN' . str_pad((string)$i, 3, '0', STR_PAD_LEFT),
                'phone' => '+62812345678' . str_pad((string)$i, 3, '0', STR_PAD_LEFT),
                'email_verified_at' => now(),
            ]);
            $dosens[] = $dosen;
        }

        // Create active students
        $students = [];
        for ($i = 1; $i <= 8; $i++) {
            $student = User::create([
                'name' => "Student " . $i,
                'email' => "student" . $i . "@ui.ac.id",
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'active',
                'laboratory_id' => fake()->randomElement($laboratories)->id,
                'student_id' => '2021' . str_pad((string)$i, 6, '0', STR_PAD_LEFT),
                'phone' => '+6281234567' . str_pad((string)$i, 3, '0', STR_PAD_LEFT),
                'email_verified_at' => now(),
            ]);
            $students[] = $student;
        }

        // Create pending verification students
        for ($i = 9; $i <= 12; $i++) {
            $student = User::create([
                'name' => "Pending Student " . $i,
                'email' => "pending.student" . $i . "@ui.ac.id",
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'pending_verification',
                'student_id' => '2024' . str_pad((string)$i, 6, '0', STR_PAD_LEFT),
                'phone' => '+6281234567' . str_pad((string)$i, 3, '0', STR_PAD_LEFT),
                'email_verified_at' => now(),
            ]);
        }

        // Create equipment for each laboratory
        $equipmentTypes = [
            // Physical Chemistry Lab
            'PCL001' => [
                'UV-Vis Spectrophotometer',
                'Infrared Spectrometer',
                'pH Meter',
                'Conductivity Meter',
                'Calorimeter',
                'Polarimeter',
                'Refractometer',
                'Viscometer',
            ],
            // Organic Chemistry Lab
            'OCL002' => [
                'Rotary Evaporator',
                'Distillation Apparatus',
                'Reflux Condenser',
                'Separatory Funnel',
                'Heating Mantle',
                'Magnetic Stirrer',
                'Vacuum Pump',
                'Melting Point Apparatus',
            ],
            // Analytical Chemistry Lab
            'ACL003' => [
                'HPLC System',
                'GC-MS System',
                'Atomic Absorption Spectrophotometer',
                'Ion Chromatograph',
                'Karl Fischer Titrator',
                'Microbalance',
                'Centrifuge',
                'Incubator',
            ],
            // Process Engineering Lab
            'PEL004' => [
                'Heat Exchanger',
                'Distillation Column',
                'Reactor Vessel',
                'Pump System',
                'Flow Meter',
                'Pressure Gauge',
                'Temperature Controller',
                'Control Valve',
            ],
        ];

        $brands = ['Thermo Fisher', 'Agilent', 'Waters', 'PerkinElmer', 'Shimadzu', 'Bruker', 'VWR', 'Sartorius'];
        $conditions = ['excellent', 'good', 'fair'];
        $statuses = ['active', 'maintenance'];

        $allEquipment = [];
        foreach ($laboratories as $lab) {
            $equipmentList = $equipmentTypes[$lab->code] ?? [];
            
            foreach ($equipmentList as $index => $equipmentName) {
                $totalQty = random_int(1, 5);
                $availableQty = random_int(0, $totalQty);
                
                $equipment = Equipment::create([
                    'laboratory_id' => $lab->id,
                    'name' => $equipmentName,
                    'code' => $lab->code . '-EQ' . str_pad((string)($index + 1), 3, '0', STR_PAD_LEFT),
                    'description' => "High-quality {$equipmentName} for laboratory use in {$lab->name}",
                    'brand' => fake()->randomElement($brands),
                    'model' => fake()->bothify('##??-####'),
                    'total_quantity' => $totalQty,
                    'available_quantity' => $availableQty,
                    'condition' => fake()->randomElement($conditions),
                    'status' => fake()->randomElement($statuses),
                    'notes' => fake()->optional(0.3)->sentence(),
                ]);
                
                $allEquipment[] = $equipment;
            }
        }

        // Create sample loan requests
        $statuses = ['pending', 'approved', 'rejected', 'borrowed', 'returned'];
        
        foreach ($students as $student) {
            // Each student gets 2-5 loan requests
            $numRequests = random_int(2, 5);
            
            for ($i = 0; $i < $numRequests; $i++) {
                $equipment = fake()->randomElement($allEquipment);
                $startDate = fake()->dateTimeBetween('-2 months', '+1 month');
                $endDate = fake()->dateTimeBetween($startDate, '+3 months');
                $status = fake()->randomElement($statuses);
                
                $loanRequest = LoanRequest::create([
                    'request_number' => 'REQ' . fake()->unique()->numberBetween(100000, 999999),
                    'user_id' => $student->id,
                    'equipment_id' => $equipment->id,
                    'laboratory_id' => $equipment->laboratory_id,
                    'quantity_requested' => random_int(1, min(3, $equipment->total_quantity)),
                    'requested_start_date' => $startDate,
                    'requested_end_date' => $endDate,
                    'purpose' => fake()->paragraph(),
                    'status' => $status,
                    'rejection_reason' => $status === 'rejected' ? fake()->sentence() : null,
                    'approved_by' => in_array($status, ['approved', 'borrowed', 'returned', 'rejected']) 
                        ? fake()->randomElement($labAssistants)->id : null,
                    'approved_at' => in_array($status, ['approved', 'borrowed', 'returned', 'rejected']) 
                        ? fake()->dateTimeBetween('-1 month', 'now') : null,
                    'borrowed_at' => in_array($status, ['borrowed', 'returned']) 
                        ? fake()->dateTimeBetween('-2 weeks', 'now') : null,
                    'returned_at' => $status === 'returned' 
                        ? fake()->dateTimeBetween('-1 week', 'now') : null,
                    'notes' => fake()->optional(0.3)->sentence(),
                ]);
            }
        }

        $this->command->info('ChemLab database seeded successfully with enhanced roles!');
        $this->command->info('Admin: admin@che.ui.ac.id / password');
        $this->command->info('Kepala Labs: kepala.lab1@che.ui.ac.id to kepala.lab4@che.ui.ac.id / password');
        $this->command->info('Lab Assistants: laboran1@che.ui.ac.id to laboran4@che.ui.ac.id / password');
        $this->command->info('Lecturers: dosen1@che.ui.ac.id to dosen3@che.ui.ac.id / password');
        $this->command->info('Active Students: student1@ui.ac.id to student8@ui.ac.id / password');
        $this->command->info('Pending Students: pending.student9@ui.ac.id to pending.student12@ui.ac.id / password');
    }
}