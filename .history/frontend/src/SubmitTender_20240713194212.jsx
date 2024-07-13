// SubmitTender.js
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SubmitTender = () => {
  const [amountUint8, setAmountUint8] = useState(0);
  const [eamountUint8, setEamountUint8] = useState(0);
  const [amountUint16, setAmountUint16] = useState(0);
  const [eamountUint16, setEamountUint16] = useState(0);
  const [amountUint32, setAmountUint32] = useState(0);
  const [eamountUint32, setEamountUint32] = useState(0);

  const handleAmountChangeUint8 = (event) => {
    // Assuming getInstance and toHexString are imported
    let _instance = getInstance();
    _instance.then((instance) => {
      setEamountUint8(toHexString(instance.encrypt8(+event.target.value)));
    });
    setAmountUint8(event.target.value);
  };

  const handleCopyClickUint8 = () => {
    if (eamountUint8) {
      navigator.clipboard.writeText("0x" + eamountUint8);
    }
  };

  const handleAmountChangeUint16 = (event) => {
    let _instance = getInstance();
    _instance.then((instance) => {
      setEamountUint16(toHexString(instance.encrypt16(+event.target.value)));
    });
    setAmountUint16(event.target.value);
  };

  const handleCopyClickUint16 = () => {
    if (eamountUint16) {
      navigator.clipboard.writeText("0x" + eamountUint16);
    }
  };

  const handleAmountChangeUint32 = (event) => {
    let _instance = getInstance();
    _instance.then((instance) => {
      setEamountUint32(toHexString(instance.encrypt32(+event.target.value)));
    });
    setAmountUint32(event.target.value);
  };

  const handleCopyClickUint32 = () => {
    if (eamountUint32) {
      navigator.clipboard.writeText("0x" + eamountUint32);
    }
  };

  return (
    <div>
      <h1>Submit Tender</h1>
      <Form className="Form-container">
        <Form.Group className="form-group">
          <Form.Label className="label">uint8: </Form.Label>
          <Form.Control
            style={{ color: "black" }}
            type="text"
            value={amountUint8}
            placeholder="10"
            onChange={handleAmountChangeUint8}
            className="Input"
          />
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label className="label">ciphertext </Form.Label>
          <Form.Control
            style={{ color: "#72FF80" }}
            type="text"
            value={"0x" + eamountUint8}
            disabled
            onChange={handleAmountChangeUint8}
            className="Input"
          />
          {eamountUint8 !== 0 && (
            <Button variant="default" onClick={handleCopyClickUint8}>
              Copy
            </Button>
          )}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label className="label">uint16: </Form.Label>
          <Form.Control
            style={{ color: "black" }}
            type="text"
            value={amountUint16}
            placeholder="10"
            onChange={handleAmountChangeUint16}
            className="Input"
          />
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label className="label">ciphertext </Form.Label>
          <Form.Control
            style={{ color: "#72FF80" }}
            type="text"
            value={"0x" + eamountUint16}
            disabled
            onChange={handleAmountChangeUint16}
            className="Input"
          />
          {eamountUint16 !== 0 && (
            <Button variant="default" onClick={handleCopyClickUint16}>
              Copy
            </Button>
          )}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label className="label">uint32: </Form.Label>
          <Form.Control
            style={{ color: "black" }}
            type="text"
            value={amountUint32}
            placeholder="10"
            onChange={handleAmountChangeUint32}
            className="Input"
          />
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label className="label">ciphertext </Form.Label>
          <Form.Control
            style={{ color: "#72FF80" }}
            type="text"
            value={"0x" + eamountUint32}
            disabled
            onChange={handleAmountChangeUint32}
            className="Input"
          />
          {eamountUint32 !== 0 && (
            <Button variant="default" onClick={handleCopyClickUint32}>
              Copy
            </Button>
          )}
        </Form.Group>
      </Form>
    </div>
  );
};

export default SubmitTender;
