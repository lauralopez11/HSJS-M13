'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';

function MeetModal({ show, handleClose, setCurrentMeet, saveMeet, meet }) {
    const isNew = meet.id === null;
    const [titleInvalid, setTitleInvalid] = useState(false);
    const titleRef = useRef(null);

    useEffect(() => {
        if (show && titleRef.current) {
            titleRef.current.focus();
        }
    }, [show]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setCurrentMeet(prevMeet => {
            const newMeet = { ...prevMeet };

            if (name === 'date' && value) {
                newMeet.date = new Date(value);

            } else if (name === 'time' && value) {
                const [hours, minutes] = value.split(':');
                newMeet.time = new Date();
                newMeet.time.setHours(hours, minutes);

            } else {
                newMeet[name] = value;
            }
            return newMeet;
        });
    }, [setCurrentMeet]);


    const handleSave = useCallback(() => {
        if (meet.title && meet.title.trim()) {
            const isWhitespaceString = str => !str.replace(/\s/g, '').length;

            saveMeet({
                ...meet,
                title: meet.title.trim(),
                description: meet.description && !isWhitespaceString(meet.description) ? meet.description : '' // ensure description is not fully withe spaces
            });
            handleClose();
        } else {
            // if the title is not set
            setTitleInvalid(true);
            titleRef.current.focus(); // Focus on the title input
        }
    }, [meet, saveMeet, handleClose]);

    // Format the date input to "YYYY-MM-DD"
    const dateString = useMemo(() => {
        if (meet.date instanceof Date) {
            const year = meet.date.getFullYear();
            const month = String(meet.date.getMonth() + 1).padStart(2, '0');
            const day = String(meet.date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        return meet.date || '';
    }, [meet.date]);

    // Format the time input to "HH:MM"
    const timeString = useMemo(() => {
        if (meet.time instanceof Date) {
            const hours = String(meet.time.getHours()).padStart(2, '0');
            const minutes = String(meet.time.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        return meet.time || '';
    }, [meet.time]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isNew ? "Add New Meet" : "Edit Meet"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FloatingLabel controlId="floatingTitle" label="Title" className="mb-3">
                        <Form.Control
                            ref={titleRef}
                            type="text"
                            placeholder="Meet Title"
                            name="title"
                            maxLength={50}
                            value={meet.title || ''}
                            onChange={(e) => { setTitleInvalid(false); handleChange(e); }}
                            onKeyDownCapture={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // prevent form submision
                                    handleSave(); // make the enter save
                                }
                            }}
                            isInvalid={titleInvalid}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingDescription" label="Description" className="mb-3">
                        <Form.Control
                            style={{ height: '150px' }}
                            as="textarea"
                            rows={3}
                            placeholder="Meet Description"
                            name="description"
                            value={meet.description || ''}
                            onChange={handleChange}
                        />
                    </FloatingLabel>
                    <Row className="g-2">
                        <Col md>
                            <FloatingLabel controlId="floatingDate" label="Date" className="mb-3">
                                <Form.Control
                                    type="date"
                                    placeholder="Due Date"
                                    name="date"
                                    value={dateString}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Col>
                        <Col md>
                            <FloatingLabel controlId="floatingTime" label="Time" className="mb-3">
                                <Form.Control
                                    type="time"
                                    placeholder="Due Time"
                                    name="time"
                                    value={timeString}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleSave}>
                    {isNew ? "Add Meet" : "Save Changes"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default MeetModal;
