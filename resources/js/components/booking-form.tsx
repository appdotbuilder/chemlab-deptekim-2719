import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { Alert, AlertDescription } from '@/components/ui/alert';

interface Equipment {
    id: number;
    name: string;
    code: string;
    brand: string;
    available_quantity: number;
    total_quantity: number;
    condition: string;
    laboratory: {
        name: string;
        code: string;
    };
    requires_training?: boolean;
    hazard_class?: string;
}

interface Supervisor {
    id: number;
    name: string;
    email: string;
    laboratory?: string;
}

interface BookingFormProps {
    equipment: Equipment;
    supervisors: Supervisor[];
    onSubmit?: (data: Record<string, unknown>) => void;
    onCancel?: () => void;
}

const STEPS = [
    { id: 1, title: 'Equipment Details', icon: '🔬' },
    { id: 2, title: 'Schedule & Duration', icon: '📅' },
    { id: 3, title: 'Purpose & Supervisor', icon: '👨‍🏫' },
    { id: 4, title: 'Safety & Documents', icon: '📋' },
    { id: 5, title: 'Review & Submit', icon: '✅' }
];

export function BookingForm({ equipment, supervisors, onSubmit, onCancel }: BookingFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [jsaFile, setJsaFile] = useState<File | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        equipment_id: equipment.id,
        quantity_requested: 1,
        requested_start_date: '',
        requested_start_time: '',
        requested_end_date: '',
        requested_end_time: '',
        purpose: '',
        supervisor_id: '',
        jsa_document: null,
        additional_notes: '',
        safety_acknowledgment: false,
    });

    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setJsaFile(file);
        // @ts-expect-error - Form expects specific type but File | null is valid
        setData('jsa_document', file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(data);
        } else {
            post(route('loan-requests.store'));
        }
    };

    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 1:
                return data.quantity_requested > 0 && data.quantity_requested <= equipment.available_quantity;
            case 2:
                return !!(data.requested_start_date && data.requested_start_time && 
                         data.requested_end_date && data.requested_end_time);
            case 3:
                return !!(data.purpose.trim() && data.supervisor_id);
            case 4:
                return !!(data.jsa_document && data.safety_acknowledgment);
            case 5:
                return true;
            default:
                return false;
        }
    };

    const getStepIcon = (step: number) => {
        if (step < currentStep) return '✅';
        if (step === currentStep) return STEPS[step - 1].icon;
        return '⭕';
    };

    const getStepColor = (step: number) => {
        if (step < currentStep) return 'bg-green-100 text-green-800 border-green-300';
        if (step === currentStep) return 'bg-blue-100 text-blue-800 border-blue-300';
        return 'bg-gray-100 text-gray-600 border-gray-300';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Progress Stepper */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-colors ${getStepColor(step.id)}`}>
                                        <span className="text-lg">{getStepIcon(step.id)}</span>
                                    </div>
                                    <span className="text-xs font-medium mt-2 text-center max-w-20">
                                        {step.title}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-4 ${
                                        step.id < currentStep ? 'bg-green-300' : 'bg-gray-300'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="text-2xl">{STEPS[currentStep - 1].icon}</span>
                            Step {currentStep}: {STEPS[currentStep - 1].title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Step 1: Equipment Details */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                {/* Equipment Info */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-3">📦 Selected Equipment</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Equipment Name</p>
                                            <p className="font-semibold">{equipment.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Equipment Code</p>
                                            <p className="font-semibold">{equipment.code}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Brand</p>
                                            <p className="font-semibold">{equipment.brand}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Laboratory</p>
                                            <p className="font-semibold">{equipment.laboratory.name}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 mt-3">
                                        <Badge className="bg-blue-100 text-blue-800">
                                            Available: {equipment.available_quantity}/{equipment.total_quantity}
                                        </Badge>
                                        <Badge className={equipment.condition === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                            {equipment.condition}
                                        </Badge>
                                        {equipment.requires_training && (
                                            <Badge variant="outline">🎓 Training Required</Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Quantity Selection */}
                                <div>
                                    <Label htmlFor="quantity">Quantity Requested *</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        max={equipment.available_quantity}
                                        value={data.quantity_requested}
                                        onChange={(e) => setData('quantity_requested', parseInt(e.target.value))}
                                        placeholder="Enter quantity needed"
                                        className="mt-1"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Maximum available: {equipment.available_quantity} units
                                    </p>
                                    {errors.quantity_requested && (
                                        <p className="text-sm text-red-600 mt-1">{errors.quantity_requested}</p>
                                    )}
                                </div>

                                {/* Safety Warnings */}
                                {equipment.hazard_class && (
                                    <Alert className="border-red-200 bg-red-50">
                                        <AlertDescription className="flex items-center gap-2">
                                            <span className="text-lg">⚠️</span>
                                            <div>
                                                <strong>Safety Warning:</strong> This equipment has hazard classification: {equipment.hazard_class}. 
                                                Proper safety protocols must be followed.
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {equipment.requires_training && (
                                    <Alert className="border-orange-200 bg-orange-50">
                                        <AlertDescription className="flex items-center gap-2">
                                            <span className="text-lg">🎓</span>
                                            <div>
                                                <strong>Training Required:</strong> This equipment requires specific training before use. 
                                                Please ensure you have completed the necessary training programs.
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}

                        {/* Step 2: Schedule & Duration */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Start Date & Time */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg">📅 Start Date & Time</h3>
                                        <div>
                                            <Label htmlFor="start_date">Start Date *</Label>
                                            <Input
                                                id="start_date"
                                                type="date"
                                                value={data.requested_start_date}
                                                onChange={(e) => setData('requested_start_date', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="mt-1"
                                            />
                                            {errors.requested_start_date && (
                                                <p className="text-sm text-red-600 mt-1">{errors.requested_start_date}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="start_time">Start Time *</Label>
                                            <Input
                                                id="start_time"
                                                type="time"
                                                value={data.requested_start_time}
                                                onChange={(e) => setData('requested_start_time', e.target.value)}
                                                className="mt-1"
                                            />
                                            {errors.requested_start_time && (
                                                <p className="text-sm text-red-600 mt-1">{errors.requested_start_time}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* End Date & Time */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg">📅 End Date & Time</h3>
                                        <div>
                                            <Label htmlFor="end_date">End Date *</Label>
                                            <Input
                                                id="end_date"
                                                type="date"
                                                value={data.requested_end_date}
                                                onChange={(e) => setData('requested_end_date', e.target.value)}
                                                min={data.requested_start_date || new Date().toISOString().split('T')[0]}
                                                className="mt-1"
                                            />
                                            {errors.requested_end_date && (
                                                <p className="text-sm text-red-600 mt-1">{errors.requested_end_date}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="end_time">End Time *</Label>
                                            <Input
                                                id="end_time"
                                                type="time"
                                                value={data.requested_end_time}
                                                onChange={(e) => setData('requested_end_time', e.target.value)}
                                                className="mt-1"
                                            />
                                            {errors.requested_end_time && (
                                                <p className="text-sm text-red-600 mt-1">{errors.requested_end_time}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Duration Summary */}
                                {data.requested_start_date && data.requested_end_date && (
                                    <Alert className="border-blue-200 bg-blue-50">
                                        <AlertDescription>
                                            <strong>📊 Loan Duration:</strong> {' '}
                                            {new Date(data.requested_end_date).getTime() - new Date(data.requested_start_date).getTime() > 0
                                                ? `${Math.ceil((new Date(data.requested_end_date).getTime() - new Date(data.requested_start_date).getTime()) / (1000 * 60 * 60 * 24))} day(s)`
                                                : 'Same day'
                                            }
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}

                        {/* Step 3: Purpose & Supervisor */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="purpose">Purpose of Use *</Label>
                                    <Textarea
                                        id="purpose"
                                        value={data.purpose}
                                        onChange={(e) => setData('purpose', e.target.value)}
                                        placeholder="Describe the purpose and nature of your work with this equipment..."
                                        rows={4}
                                        className="mt-1"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Be specific about your research, experiment, or project requirements.
                                    </p>
                                    {errors.purpose && (
                                        <p className="text-sm text-red-600 mt-1">{errors.purpose}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="supervisor">Supervisor / Dosen Pembimbing *</Label>
                                    <Select value={data.supervisor_id} onValueChange={(value) => setData('supervisor_id', value)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select your supervisor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {supervisors.map((supervisor) => (
                                                <SelectItem key={supervisor.id} value={supervisor.id.toString()}>
                                                    {supervisor.name} ({supervisor.email})
                                                    {supervisor.laboratory && ` - ${supervisor.laboratory}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Your supervisor must approve and oversee the equipment usage.
                                    </p>
                                    {errors.supervisor_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.supervisor_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.additional_notes}
                                        onChange={(e) => setData('additional_notes', e.target.value)}
                                        placeholder="Any additional information or special requirements..."
                                        rows={3}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Safety & Documents */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="jsa_document">Job Safety Analysis (JSA) Document *</Label>
                                    <Input
                                        id="jsa_document"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                        className="mt-1"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Upload your completed JSA document (PDF, DOC, or DOCX format, max 10MB)
                                    </p>
                                    {jsaFile && (
                                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                                            <span className="text-green-600">📄</span>
                                            <span className="text-sm font-medium">{jsaFile.name}</span>
                                            <span className="text-xs text-green-600">
                                                ({(jsaFile.size / 1024 / 1024).toFixed(2)} MB)
                                            </span>
                                        </div>
                                    )}
                                    {errors.jsa_document && (
                                        <p className="text-sm text-red-600 mt-1">{errors.jsa_document}</p>
                                    )}
                                </div>

                                <Alert className="border-yellow-200 bg-yellow-50">
                                    <AlertDescription>
                                        <strong>📋 JSA Requirements:</strong>
                                        <ul className="list-disc ml-6 mt-2 text-sm">
                                            <li>Complete hazard identification and risk assessment</li>
                                            <li>Detailed safety control measures</li>
                                            <li>Emergency procedures and contacts</li>
                                            <li>Personal protective equipment (PPE) requirements</li>
                                            <li>Supervisor signature and approval</li>
                                        </ul>
                                    </AlertDescription>
                                </Alert>

                                <div className="flex items-center space-x-2">
                                    <input
                                        id="safety_acknowledgment"
                                        type="checkbox"
                                        checked={data.safety_acknowledgment || false}
                                        // @ts-expect-error - Form expects specific type but boolean is valid
                                        onChange={(e) => setData('safety_acknowledgment', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <Label htmlFor="safety_acknowledgment" className="text-sm">
                                        I acknowledge that I have read and understood all safety requirements, 
                                        and I commit to following proper safety protocols during equipment usage. *
                                    </Label>
                                </div>
                                {errors.safety_acknowledgment && (
                                    <p className="text-sm text-red-600">{errors.safety_acknowledgment}</p>
                                )}
                            </div>
                        )}

                        {/* Step 5: Review & Submit */}
                        {currentStep === 5 && (
                            <div className="space-y-6">
                                <Alert className="border-blue-200 bg-blue-50">
                                    <AlertDescription>
                                        <strong>🔍 Please review your request details before submitting.</strong>
                                    </AlertDescription>
                                </Alert>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Equipment Summary */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">🔬 Equipment Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div><strong>Equipment:</strong> {equipment.name}</div>
                                            <div><strong>Code:</strong> {equipment.code}</div>
                                            <div><strong>Laboratory:</strong> {equipment.laboratory.name}</div>
                                            <div><strong>Quantity:</strong> {data.quantity_requested} unit(s)</div>
                                        </CardContent>
                                    </Card>

                                    {/* Schedule Summary */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">📅 Schedule Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div><strong>Start:</strong> {data.requested_start_date} at {data.requested_start_time}</div>
                                            <div><strong>End:</strong> {data.requested_end_date} at {data.requested_end_time}</div>
                                            <div><strong>Supervisor:</strong> {supervisors.find(s => s.id.toString() === data.supervisor_id)?.name}</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Purpose & Documents */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">📋 Additional Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div>
                                            <strong>Purpose:</strong>
                                            <p className="mt-1 p-2 bg-gray-50 rounded">{data.purpose}</p>
                                        </div>
                                        {data.additional_notes && (
                                            <div>
                                                <strong>Notes:</strong>
                                                <p className="mt-1 p-2 bg-gray-50 rounded">{data.additional_notes}</p>
                                            </div>
                                        )}
                                        <div>
                                            <strong>JSA Document:</strong> {jsaFile?.name || 'No file uploaded'}
                                        </div>
                                        <div>
                                            <strong>Safety Acknowledgment:</strong> {data.safety_acknowledgment ? '✅ Acknowledged' : '❌ Not acknowledged'}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between">
                            <div>
                                {currentStep > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={processing}
                                    >
                                        ← Previous Step
                                    </Button>
                                )}
                                {onCancel && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onCancel}
                                        className="ml-2"
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                            <div>
                                {currentStep < STEPS.length ? (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!isStepValid(currentStep)}
                                    >
                                        Next Step →
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={processing || !isStepValid(currentStep)}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {processing ? '⏳ Submitting...' : '🚀 Submit Request'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}