'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  placeholder?: string;
  readOnly?: boolean;
}

export default function JsonEditor({
  value,
  onChange,
  height = '300px',
  placeholder = '{\n  \n}',
  readOnly = false
}: JsonEditorProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update internal value when external value changes
  useEffect(() => {
    setInternalValue(value);
    validateJson(value);
  }, [value]);

  // Validate JSON and update state
  const validateJson = (json: string) => {
    if (!json.trim()) {
      setIsValid(false);
      setErrorMessage('JSON cannot be empty');
      return false;
    }

    try {
      JSON.parse(json);
      setIsValid(true);
      setErrorMessage(null);
      return true;
    } catch (error) {
      setIsValid(false);
      setErrorMessage((error as Error).message);
      return false;
    }
  };

  // Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    validateJson(newValue);
  };

  // Commit changes to parent component
  const commitChanges = () => {
    if (validateJson(internalValue)) {
      onChange(internalValue);
      toast.success('JSON validated successfully');
    } else {
      toast.error('Please fix JSON errors before saving');
    }
  };

  // Format JSON
  const formatJson = () => {
    try {
      const parsedJson = JSON.parse(internalValue);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setInternalValue(formattedJson);
      validateJson(formattedJson);
      toast.success('JSON formatted');
    } catch (error) {
      toast.error('Cannot format invalid JSON');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "relative border rounded-md font-mono text-sm",
          !isValid && "border-destructive",
          readOnly && "bg-muted opacity-80"
        )}
        style={{ height }}
      >
        <textarea
          value={internalValue}
          onChange={handleChange}
          className="w-full h-full p-3 resize-none font-mono text-sm bg-transparent focus:outline-none"
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck={false}
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm">
          {isValid ? (
            <div className="flex items-center text-green-600">
              <Check className="h-4 w-4 mr-1" />
              <span>Valid JSON</span>
            </div>
          ) : (
            <div className="flex items-center text-destructive">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={formatJson}
            >
              Format
            </Button>
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={commitChanges}
              disabled={!isValid}
            >
              Apply
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 