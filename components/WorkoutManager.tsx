"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/../components/ui/card';
import { Button } from '@/../components/ui/button';
import { Input } from '@/../components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/../components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/../components/ui/select';
import { Plus, Edit, Trash2, Save } from 'lucide-react';

const exerciseCategories = [
    'Compound',
    'Isolation',
    'Bodyweight',
    'Machine',
    'Free Weights'
];

interface Exercise {
    name: string;
    sets: number;
    reps: string;
    category: string;
}

interface WorkoutDay {
    focus: string;
    exercises: Exercise[];
}

interface WorkoutData {
    [key: string]: WorkoutDay;
}

const WorkoutManager = () => {
    const [workoutData, setWorkoutData] = useState<WorkoutData>({
        'Day 1: Upper Body Push': {
            focus: 'Chest, Shoulders, Triceps',
            exercises: [
                { name: 'Bench Press', sets: 4, reps: '6-8', category: 'Compound' },
                { name: 'Incline Dumbbell Press', sets: 3, reps: '8-10', category: 'Compound' },
                { name: 'Overhead Shoulder Press', sets: 3, reps: '8-10', category: 'Compound' },
                { name: 'Lateral Raises', sets: 3, reps: '12', category: 'Isolation' },
                { name: 'Tricep Dips', sets: 3, reps: '10', category: 'Compound' },
                { name: 'Tricep Pushdowns', sets: 3, reps: '12', category: 'Isolation' }
            ]
        },
        'Day 2: Lower Body': {
            focus: 'Quads, Hamstrings, Calves',
            exercises: [
                { name: 'Squats', sets: 4, reps: '6-8', category: 'Compound' },
                { name: 'Leg Press', sets: 3, reps: '10', category: 'Machine' },
                { name: 'Leg Curls', sets: 3, reps: '12', category: 'Machine' },
                { name: 'Calf Raises', sets: 3, reps: '15', category: 'Isolation' },
                { name: 'Lunges', sets: 3, reps: '10 per leg', category: 'Compound' }
            ]
        },
        'Day 3: Upper Body Pull': {
            focus: 'Back, Biceps',
            exercises: [
                { name: 'Deadlifts', sets: 4, reps: '6-8', category: 'Compound' },
                { name: 'Pull-Ups or Lat Pulldowns', sets: 3, reps: '8-10', category: 'Compound' },
                { name: 'Bent Over Rows', sets: 3, reps: '8-10', category: 'Compound' },
                { name: 'Face Pulls', sets: 3, reps: '12', category: 'Isolation' },
                { name: 'Bicep Curls', sets: 3, reps: '12', category: 'Isolation' },
                { name: 'Hammer Curls', sets: 3, reps: '12', category: 'Isolation' }
            ]
        },
        'Day 4: Lower Body': {
            focus: 'Quads, Hamstrings, Calves',
            exercises: [
                { name: 'Deadlifts', sets: 4, reps: '6-8', category: 'Compound' },
                { name: 'Leg Extensions', sets: 3, reps: '12', category: 'Machine' },
                { name: 'Leg Curls', sets: 3, reps: '12', category: 'Machine' },
                { name: 'Calf Raises', sets: 3, reps: '15', category: 'Isolation' },
                { name: 'Hip Thrusts', sets: 3, reps: '10', category: 'Compound' }
            ]
        }
    });

    const [selectedDay, setSelectedDay] = useState<string>(Object.keys(workoutData)[0]);
    const [editingExercise, setEditingExercise] = useState<number | null>(null);
    const [newExercise, setNewExercise] = useState<Exercise>({
        name: '',
        sets: 0,
        reps: '',
        category: ''
    });
    const [newDay, setNewDay] = useState<{ name: string; focus: string }>({ name: '', focus: '' });

    const handleUpdateExercise = (index: number, updatedExercise: Exercise) => {
        const updatedData = { ...workoutData };
        updatedData[selectedDay].exercises[index] = updatedExercise;
        setWorkoutData(updatedData);
        setEditingExercise(null);
    };

    const handleDeleteExercise = (index: number) => {
        const updatedData = { ...workoutData };
        updatedData[selectedDay].exercises.splice(index, 1);
        setWorkoutData(updatedData);
    };

    const handleAddExercise = () => {
        if (newExercise.name && newExercise.sets && newExercise.reps && newExercise.category) {
            const updatedData = { ...workoutData };
            updatedData[selectedDay].exercises.push({
                name: newExercise.name,
                sets: parseInt(newExercise.sets.toString()),
                reps: newExercise.reps,
                category: newExercise.category
            });
            setWorkoutData(updatedData);
            setNewExercise({ name: '', sets: 0, reps: '', category: '' });
        }
    };

    const handleAddDay = () => {
        if (newDay.name && newDay.focus) {
            const dayName = `Day ${Object.keys(workoutData).length + 1}: ${newDay.name}`;
            setWorkoutData({
                ...workoutData,
                [dayName]: {
                    focus: newDay.focus,
                    exercises: []
                }
            });
            setNewDay({ name: '', focus: '' });
        }
    };

    const handleDeleteDay = (day: string) => {
        const updatedData = { ...workoutData };
        delete updatedData[day];
        setWorkoutData(updatedData);
        setSelectedDay(Object.keys(updatedData)[0]);
    };

    useEffect(() => {
        // Load data from localStorage on component mount
        const savedData = localStorage.getItem('workoutData');
        if (savedData) {
            setWorkoutData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('workoutData', JSON.stringify(workoutData));
    }, [workoutData]);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Workout Program Manager</CardTitle>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Day
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Workout Day</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Day Name"
                                        value={newDay.name}
                                        onChange={(e) => setNewDay({ ...newDay, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Focus (e.g., Chest, Back)"
                                        value={newDay.focus}
                                        onChange={(e) => setNewDay({ ...newDay, focus: e.target.value })}
                                    />
                                </div>
                                <Button onClick={handleAddDay}>Add Day</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Tabs value={selectedDay} onValueChange={setSelectedDay}>
                        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
                            {Object.keys(workoutData).map((day) => (
                                <TabsTrigger key={day} value={day} className="text-sm">
                                    {day.split(':')[0]}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {Object.entries(workoutData).map(([day, data]) => (
                            <TabsContent key={day} value={day}>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl">{day}</CardTitle>
                                            <p className="text-muted-foreground">{data.focus}</p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteDay(day)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {data.exercises.map((exercise, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                                                >
                                                    {editingExercise === index ? (
                                                        <div className="flex-1 flex gap-2">
                                                            <Input
                                                                value={exercise.name}
                                                                onChange={(e) =>
                                                                    handleUpdateExercise(index, {
                                                                        ...exercise,
                                                                        name: e.target.value
                                                                    })
                                                                }
                                                                className="flex-1"
                                                            />
                                                            <Input
                                                                value={exercise.sets}
                                                                onChange={(e) =>
                                                                    handleUpdateExercise(index, {
                                                                        ...exercise,
                                                                        sets: parseInt(e.target.value)
                                                                    })
                                                                }
                                                                type="number"
                                                                className="w-20"
                                                            />
                                                            <Input
                                                                value={exercise.reps}
                                                                onChange={(e) =>
                                                                    handleUpdateExercise(index, {
                                                                        ...exercise,
                                                                        reps: e.target.value
                                                                    })
                                                                }
                                                                className="w-20"
                                                            />
                                                            <Button
                                                                size="sm"
                                                                onClick={() => setEditingExercise(null)}
                                                            >
                                                                <Save className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="font-medium">{exercise.name}</span>
                                                            <span className="text-sm text-muted-foreground">
                                                                {exercise.category}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                {exercise.sets} sets × {exercise.reps} reps
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setEditingExercise(index)}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteExercise(index)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}

                                            <div className="flex gap-2 mt-4">
                                                <Select
                                                    value={newExercise.category}
                                                    onValueChange={(value) =>
                                                        setNewExercise({ ...newExercise, category: value })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {exerciseCategories.map((category) => (
                                                            <SelectItem key={category} value={category}>
                                                                {category}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Input
                                                    placeholder="Exercise name"
                                                    value={newExercise.name}
                                                    onChange={(e) =>
                                                        setNewExercise({ ...newExercise, name: e.target.value })
                                                    }
                                                />
                                                <Input
                                                    placeholder="Sets"
                                                    type="number"
                                                    className="w-20"
                                                    value={newExercise.sets}
                                                    onChange={(e) =>
                                                        setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })
                                                    }
                                                />
                                                <Input
                                                    placeholder="Reps"
                                                    className="w-20"
                                                    value={newExercise.reps}
                                                    onChange={(e) =>
                                                        setNewExercise({ ...newExercise, reps: e.target.value })
                                                    }
                                                />
                                                <Button onClick={handleAddExercise}>
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default WorkoutManager;