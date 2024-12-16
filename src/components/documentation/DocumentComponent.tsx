import type React from "react";
import styled from "./DocumentationComponent.module.scss";

const DocumentComponent = ({
  title,
  component,
  propDocs,
}: {
  title: string;
  component: React.ReactNode;
  propDocs: {
    prop: string;
    description: string;
    type: string;
    defaultValue: string;
  }[];
}) => {
  return (
    <div className={styled.Wrapper}>
      <div className={styled.Title}>{title}</div>
      <div className={styled.Container}>
        <div >{component}</div>
        <table>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Description</th>
              <th>Type</th>
              <th>Default value</th>
            </tr>
          </thead>
          <tbody>
            {propDocs.map((doc) => {
              return (
                <tr key={doc.description}>
                  <td>{doc.prop}</td>
                  <td>{doc.description}</td>
                  <td>{doc.type}</td>
                  <td>
                    <code>{doc.defaultValue}</code>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentComponent;
