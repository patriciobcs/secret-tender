import "./App.css";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Form, Button } from "react-bootstrap";
import { init, getInstance, FHEVMInstance } from "./utils/fhevm";
import { toHexString } from "./utils/utils";
import { Connect } from "./Connect";

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  if (!isInitialized) return null;

  return (
    <div className="App">
      <div className="menu">
        <Connect>{(account: string, provider: any) => <Example />}</Connect>
      </div>
    </div>
  );
};

const Example: React.FC = () => {
  const [amountUint8, setAmountUint8] = useState<number | string>(0);
  const [eamountUint8, setEamountUint8] = useState<string>("");
  const [amountUint16, setAmountUint16] = useState<number | string>(0);
  const [eamountUint16, setEamountUint16] = useState<string>("");
  const [amountUint32, setAmountUint32] = useState<number | string>(0);
  const [eamountUint32, setEamountUint32] = useState<string>("");

  const handleAmountChangeUint8 = (event: ChangeEvent<HTMLInputElement>) => {
    const _instance = getInstance();
    _instance.then((instance: FHEVMInstance) => {
      setEamountUint8(toHexString(instance.encrypt8(+event.target.value)));
    });
    setAmountUint8(event.target.value);
  };

  const handleCopyClickUint8 = () => {
    if (eamountUint8) {
      navigator.clipboard.writeText("0x" + eamountUint8);
    }
  };

  const handleAmountChangeUint16 = (event: ChangeEvent<HTMLInputElement>) => {
    const _instance = getInstance();
    _instance.then((instance: FHEVMInstance) => {
      setEamountUint16(toHexString(instance.encrypt16(+event.target.value)));
    });
    setAmountUint16(event.target.value);
  };

  const handleCopyClickUint16 = () => {
    if (eamountUint16) {
      navigator.clipboard.writeText("0x" + eamountUint16);
    }
  };

  const handleAmountChangeUint32 = (event: ChangeEvent<HTMLInputElement>) => {
    const _instance = getInstance();
    _instance.then((instance: FHEVMInstance) => {
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
      <h1>
        Welcome to <span>Inco Network</span>
      </h1>
      <span className="footer">
        Switch to Inco Gentry Testnet on Metamask:{" "}
        <a
          href="https://docs.inco.network/getting-started/connect-metamask"
          target="_blank"
          rel="noopener noreferrer">
          Guide
        </a>
      </span>
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
            className="Input"
          />
          {eamountUint8 && <Button onClick={handleCopyClickUint8}>Copy</Button>}
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
            className="Input"
          />
          {eamountUint16 && (
            <Button onClick={handleCopyClickUint16}>Copy</Button>
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
            className="Input"
          />
          {eamountUint32 && (
            <Button onClick={handleCopyClickUint32}>Copy</Button>
          )}
        </Form.Group>
      </Form>
      <br />
      <span className="footer">
        Documentation:{" "}
        <a
          href="https://docs.inco.network/introduction/inco-network-introduction"
          target="_blank"
          rel="noopener noreferrer">
          docs.inco.network
        </a>
      </span>
    </div>
  );
};

export default App;
