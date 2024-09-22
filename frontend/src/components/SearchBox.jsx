import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleSearch = () => {
    setIsExpanded(!isExpanded);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };

  return (
    <Form className="d-flex" onSubmit={submitHandler}>
      <InputGroup
        className={`search-box`}
        onMouseEnter={handleToggleSearch}
        onMouseLeave={handleToggleSearch}
      >
        <FormControl
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Here..."
          aria-label="Search Products"
          aria-describedby="button-search"
          className="rounded-top-0"
          style={{ display: isExpanded ? "block" : "none" }}
        />
        <Button
          variant={isExpanded ? "outline-primary" : "link"}
          type="submit"
          id="button-search"
          className="rounded-bottom"
        >
          <FontAwesomeIcon icon={faSearch} />
        </Button>
      </InputGroup>
    </Form>
  );
}
